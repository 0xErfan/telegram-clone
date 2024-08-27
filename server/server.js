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
await connectToDB()

io.on('connection', socket => {

    socket.on('newMessage', async ({ roomID, sender, message }) => {

        let tempID = Date.now()

        const msgData = {
            sender,
            message,
            roomID,
            seen: [],
            createdAt: Date.now()
        }

        io.to(roomID).emit('newMessage', { ...msgData, _id: tempID })

        try {

            const newMsg = await MessageModel.create(msgData)

            io.to(roomID).emit('lastMsgUpdate', newMsg)
            io.to(roomID).emit('newMessageIdUpdate', { tempID, _id: newMsg._id })

            tempID = null

            await RoomModel.findOneAndUpdate(
                { _id: roomID },
                { $push: { messages: newMsg._id } }
            )
        } catch (error) { console.log(error) }

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

        for (const room of userRooms) socket.join(room._id.toString())

        const processRooms = async () => {
            const promises = userRooms.map(async (room) => {
                const lastMsgID = room.messages?.[room.messages.length - 1]?._id || null;
                const lastMsgData = await MessageModel.findOne({ _id: lastMsgID });
                return { ...room, lastMsgData };
            });
            return Promise.all(promises);
        };

        const rooms = await processRooms()
        const sortedRooms = rooms.sort((a, b) => b.lastMsgData?.createdAt - a.lastMsgData?.createdAt)

        socket.emit('getRooms', sortedRooms)
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
            });

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
})