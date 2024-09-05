import connectToDB from "../src/db/db.js"
import { Server } from 'socket.io'
import RoomModel from "../src/models/Room.js"
import MessageModel from "../src/models/Message.js"
import MediaModel from "../src/models/Media.js"
import LocationModel from "../src/models/Location.js"
import UserModel from "../src/models/User.js"

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['PUT', 'POST']
    }
})

let typings = []
let onlineUsers = []

await connectToDB()

io.on('connection', socket => {

    socket.on('newMessage', async ({ roomID, sender, message, replayData }) => {

        let tempID = Date.now()

        const msgData = {
            sender,
            message,
            roomID,
            seen: [],
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

        socket.emit('createRoom', newRoomData)

        let isRoomExist = false

        if (newRoomData.type === 'private') isRoomExist = await RoomModel.findOne({ name: newRoomData.name })

        if (!isRoomExist) {

            let msgData = message
            delete newRoomData.message

            const newRoom = await RoomModel.create(newRoomData)

            if (msgData) {
                const newMsg = await MessageModel.create({ ...msgData, roomID: newRoom._id })
                msgData = newMsg
                newRoom.messages = [newMsg._id]
                newRoom.lastMsgData = msgData
                await newRoom.save()
            }

            socket.join(newRoom._id)
            io.emit('newRoom', newRoom._id)

            const otherRoomMembersSocket = onlineUsers.filter(data => newRoom.participants.some(pID => { if (data.userID === pID.toString()) return true }))
            otherRoomMembersSocket.forEach(data => io.to(data.socketID).emit('createRoom', newRoom))

        }
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

    socket.on('getRooms', async userID => {

        const userRooms = await RoomModel.find({ participants: { $in: userID } }).lean()

        const userPvs = await RoomModel.find({
            $and: [
                { participants: { $in: userID } },
                { type: 'private' }
            ]
        }).lean().populate('participants')

        for (const room of userRooms) {
            room.participants = userPvs.find(data => data._id.toString() == room._id.toString())?.participants || room.participants
            socket.join(room._id.toString())
        }

        onlineUsers.push({ socketID: socket.id, userID })
        io.to([...socket.rooms]).emit('updateOnlineUsers', onlineUsers)

        const getRoomsLastMsgData = async () => {
            const promises = userRooms.map(async (room) => {
                if (room?.messages?.length) {
                    const lastMsgID = room.messages[room.messages.length - 1]?._id || null;
                    const lastMsgData = await MessageModel.findOne({ _id: lastMsgID });
                    return { ...room, lastMsgData };
                } else return room
            });
            return Promise.all(promises);
        };

        const rooms = await getRoomsLastMsgData()

        socket.emit('getRooms', rooms)
    })

    socket.on('joining', async newRoom => {

        const roomData = await RoomModel.findOne({ _id: newRoom })
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

        roomData?.type == 'private' && await roomData.populate('participants')

        socket.emit('joining', roomData)
    })

    socket.on('typing', data => {
        if (!typings.includes(data.sender.name)) {
            io.to(data.roomID).emit('typing', data)
            typings.push(data.sender.name)
        }
    })

    socket.on('stop-typing', data => {
        typings = typings.filter(tl => tl !== data.sender.name)
        io.to(data.roomID).emit('stop-typing', data)
    })

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(data => data.socketID !== socket.id)
        io.to([...socket.rooms]).emit('updateOnlineUsers', onlineUsers)
    });

})