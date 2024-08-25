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

await connectToDB()

io.on('connection', async socket => {

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

        const processRooms = async () => {
            const promises = userRooms.map(async (room) => {
                const lastMsgID = room.messages?.[room.messages.length - 1]?._id || null;
                const lastMsgData = await MessageModel.findOne({ _id: lastMsgID });
                console.log(lastMsgData.createdAt)
                return { ...room, lastMsgData };
            });
            return Promise.all(promises);
        };

        const rooms = await processRooms()
        const sortedRooms = rooms.sort((a, b) => b.lastMsgData.createdAt - a.lastMsgData.createdAt)

        socket.emit('getRooms', sortedRooms)
    })

    socket.on('joining', async newRoom => {

        socket.join(newRoom)

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

    // socket.on('leavingRoom', roomID => socket.leave(roomID))
})