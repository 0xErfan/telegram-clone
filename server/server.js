import connectToDB from "../src/db/db.js"
import { Server } from 'socket.io'
import RoomModel from "../src/models/Room.js"
import MessageModel from "../src/models/Message.js"
import MediaModel from "../src/models/Media.js"
import LocationModel from "../src/models/Location.js"
import UserModel from "../src/models/User.js"

const io = new Server(3001, {
    cors: {
        origin: '*',
        methods: ['PUT', 'POST']
    },
    pingTimeout: 30000
})

let typings = []
let onlineUsers = []

await connectToDB()

io.on('connection', socket => {

    socket.on('newMessage', async ({ roomID, sender, message, replayData, voiceData = null }) => {

        let tempID = Date.now()

        const msgData = {
            sender,
            message,
            roomID,
            seen: [],
            voiceData,
            createdAt: Date.now()
        }

        io.to(roomID).emit('newMessage', {
            ...msgData,
            _id: tempID,
            replayedTo: replayData ? replayData.replayedTo : null
        })

        try {

            const newMsg = await MessageModel.create(msgData)

            io.to(roomID).emit('lastMsgUpdate', newMsg)
            io.to(roomID).emit('newMessageIdUpdate', { tempID, _id: newMsg._id })
            io.to(roomID).emit('updateLastMsgData', { msgData, roomID })

            tempID = null

            if (replayData) {
                await MessageModel.findOneAndUpdate(
                    { _id: replayData.targetID },
                    { $push: { replays: newMsg._id } }
                )
                newMsg.replayedTo = replayData.replayedTo
                await newMsg.save()
            }

            await RoomModel.findOneAndUpdate(
                { _id: roomID },
                { $push: { messages: newMsg._id } }
            )
        } catch (error) { console.log(error) }

    })

    socket.on('createRoom', async ({ newRoomData, message = null }) => {

        let isRoomExist = false

        if (newRoomData.type === 'private') {
            isRoomExist = await RoomModel.findOne({ name: newRoomData.name })
        } else {
            isRoomExist = await RoomModel.findOne({ _id: newRoomData._id })
        }

        if (!isRoomExist) {

            let msgData = message

            if (newRoomData.type === 'private') {
                newRoomData.participants = newRoomData.participants.map(data => data?._id)
            }

            const newRoom = await RoomModel.create(newRoomData)

            if (msgData) {
                const newMsg = await MessageModel.create({ ...msgData, roomID: newRoom._id })
                msgData = newMsg
                newRoom.messages = [newMsg._id]
                await newRoom.save()
            }

            socket.join(newRoom._id)

            const otherRoomMembersSocket = onlineUsers.filter(data => newRoom.participants.some(pID => { if (data.userID === pID.toString()) return true }))

            otherRoomMembersSocket.forEach(({ socketID: userSocketID }) => {
                const socketID = io.sockets.sockets.get(userSocketID)
                socketID && socketID.join(newRoom._id)
            })

            io.to(newRoom._id).emit('createRoom', newRoom)

        }
    })

    socket.on('joinRoom', async ({ roomID, userID }) => {

        const roomTarget = await RoomModel.findOne({ _id: roomID })

        if (roomTarget && !roomTarget?.participants.includes(userID)) {

            roomTarget.participants = [...roomTarget.participants, userID]
            socket.join(roomID)
            await roomTarget.save()

            io.to(roomID).emit('joinRoom', { userID, roomID })
        }

    })

    socket.on('deleteRoom', async roomID => {
        io.to(roomID).emit('deleteRoom', roomID)
        io.to(roomID).emit('updateLastMsgData', { msgData: null, roomID })
        await RoomModel.findOneAndDelete({ _id: roomID })
        await MessageModel.deleteMany({ roomID })
    })

    socket.on('deleteMsg', async ({ forAll, msgID, roomID }) => {

        if (forAll) {

            io.to(roomID).emit('deleteMsg', msgID)

            await MessageModel.findOneAndDelete({ _id: msgID })
            io.to(roomID).emit('updateLastMsgData', { msgData: null, roomID })

            await RoomModel.findOneAndUpdate(
                { _id: roomID },
                { $pull: { messages: msgID } }
            )

        } else {

            socket.emit('deleteMsg', msgID)

            const userID = onlineUsers.find(ud => ud.socketID == socket.id)?.userID

            userID &&
                await MessageModel.findOneAndUpdate(
                    { _id: msgID },
                    {
                        $push: { hideFor: userID }
                    }
                )

        }

    })

    socket.on('editMessage', async ({ msgID, editedMsg, roomID }) => {
        io.to(roomID).emit('editMessage', { msgID, editedMsg, roomID })
        const updatedMsgData = await MessageModel.findOneAndUpdate({ _id: msgID }, { message: editedMsg, isEdited: true }).lean()
        io.to(roomID).emit('updateLastMsgData', { roomID, msgData: { ...updatedMsgData, message: editedMsg } })
    })

    socket.on('seenMsg', async (seenData) => {

        io.to(seenData.roomID).emit('seenMsg', seenData)

        try {
            await MessageModel.findOneAndUpdate(
                { _id: seenData.msgID },
                { $push: { seen: seenData.seenBy } }
            )
        } catch (error) { console.log(error) }

    })

    socket.on('listenToVoice', async ({ userID, voiceID, roomID }) => {

        io.to(roomID).emit('listenToVoice', { userID, voiceID, roomID })

        const targetMessage = await MessageModel.findOne({ _id: voiceID }).exec()
        const voiceMessagePlayedByList = targetMessage?.voiceData?.playedBy

        if (!voiceMessagePlayedByList?.includes(userID)) {
            const userIdWithSeenTime = `${userID}_${new Date}`
            targetMessage.voiceData.playedBy = [...voiceMessagePlayedByList, userIdWithSeenTime]
            targetMessage.save()
        }

    })

    socket.on('getRooms', async userID => {

        const userRooms = await RoomModel.find({ participants: { $in: userID } }).lean()

        const userPvs = await RoomModel.find({
            $and: [
                { participants: { $in: userID } },
                { type: 'private' }
            ]
        }).lean().populate('participants')

        for (const room of userRooms) {
            room.participants = userPvs.find(data => data._id.toString() === room._id.toString())?.participants || room.participants
            socket.join(room._id.toString())
        }

        onlineUsers.push({ socketID: socket.id, userID })
        io.to([...socket.rooms]).emit('updateOnlineUsers', onlineUsers)

        const getRoomsData = async () => {
            const promises = userRooms.map(async (room) => {
                const lastMsgData = room?.messages?.length
                    ?
                    await MessageModel.findOne({ _id: room.messages.at(-1)?._id })
                    :
                    null;

                const notSeenCount = await MessageModel.find({
                    $and: [
                        { roomID: room?._id },
                        { sender: { $ne: userID } },
                        { seen: { $nin: [userID] } }
                    ]
                });

                return {
                    ...room,
                    lastMsgData,
                    notSeenCount: notSeenCount?.length
                };
            });

            return Promise.all(promises);
        };

        const rooms = await getRoomsData()

        socket.emit('getRooms', rooms)
    })

    socket.on('joining', async (query, defaultRoomData = null) => {

        let roomData = await RoomModel.findOne({ $or: [{ _id: query }, { name: query }] })
            .populate('messages', '', MessageModel)
            .populate('medias', '', MediaModel)
            .populate('locations', '', LocationModel)
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    model: UserModel
                }
            })
            .populate({
                path: 'messages',
                populate: {
                    path: 'replay',
                    model: MessageModel,
                },
            });

        roomData && roomData?.type === 'private' && await roomData.populate('participants')

        if (!roomData?._id) {
            roomData = defaultRoomData
        }

        socket.emit('joining', roomData)

    })

    socket.on('pinMessage', async (id, roomID, isLastMessage) => {

        io.to(roomID).emit('pinMessage', id)

        const messageToPin = await MessageModel.findOne({ _id: id })

        messageToPin.pinnedAt = messageToPin?.pinnedAt ? null : Date.now() // toggle between pin & unpin
        await messageToPin.save()

        if (isLastMessage) {
            io.to(roomID).emit('updateLastMsgData', { msgData: messageToPin, roomID })
        }

    })

    socket.on('updateLastMsgPos', async ({ roomID, scrollPos, userID }) => {

        try {

            const userTarget = await UserModel.findOne({ _id: userID });
            
            if (!userTarget) {
                console.log(`User not found: ${userID}`);
                return;
            }

            if (!userTarget.roomMessageTrack) {
                userTarget.roomMessageTrack = [];
            }

            const isRoomExist = userTarget.roomMessageTrack.some(room => {
                if (room.roomId === roomID) {
                    room.scrollPos = scrollPos;
                    return true;
                }
                return false;
            });

            if (!isRoomExist) {
                userTarget.roomMessageTrack.push({ roomId: roomID, scrollPos });
            }

            await userTarget.save();

        } catch (error) { console.log('Error updating user data:', error) }

    });

    socket.on('typing', data => {
        if (!typings.includes(data.sender.name)) {
            io.to(data.roomID).emit('typin54g', data)
            typings.push(data.sender.name)
        }
    })

    socket.on('stop-typing', data => {
        typings = typings.filter(tl => tl !== data.sender.name)
        io.to(data.roomID).emit('stop-typing', data)
    })

    socket.on('updateUserData', async (updatedFields) => {
        await UserModel.findOneAndUpdate({ _id: updatedFields.userID }, updatedFields)
        socket.emit('updateUserData')
    })

    socket.on('ping', () => socket.emit('pong'))

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(data => data.socketID !== socket.id)
        io.to([...socket.rooms]).emit('updateOnlineUsers', onlineUsers)
    });

})