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

    socket.on('getRooms', async userID => {

        const userRooms = await RoomModel.find({ participants: { $in: userID } }).lean()

        const processRooms = async () => {
            const promises = userRooms.map(async (room) => {
                const lastMsgID = room.messages?.[room.messages.length - 1]?._id || null;
                const lastMsgData = await MessageModel.findOne({ _id: lastMsgID });
                return { ...room, lastMsgData };
            });
            return Promise.all(promises);
        };

        socket.emit('getRooms', await processRooms())
    })

    socket.on('joining', async roomID => {
        const roomData = await RoomModel.findOne({ _id: roomID })
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

        socket.emit('joining', roomData)
    })

})