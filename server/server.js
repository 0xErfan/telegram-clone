import connectToDB from "../src/db/db.js"
import { Server } from 'socket.io'
import RoomModel from "../src/models/Room.js"
import MessageModel from "../src/models/Message.js"

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['PUT', 'POST']
    }
})

io.on('connection', async socket => {

    await connectToDB()

    socket.on('message', async ({ roomID, messageData }) => {

        const senderData = await UserModel.findById(messageData.sender)

        await RoomModel.findOneAndUpdate(
            { _id: roomID },
            { $push: { messages: messageData } }
        )

        const newMessageData = {
            message: messageData.message,
            _id: Date.now() + (Math.random(3000)),
            createdAt: Date.now(),
            sender: senderData,
        }

        io.emit('message', newMessageData)
    })

    socket.on('seen', async _id => {
        io.emit('seen', _id)
        // await MessageModel.findOneAndUpdate({ _id }, { seen: true })
    })

})