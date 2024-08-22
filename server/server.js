import connectToDB from "../src/db/db.js"
import { Server } from 'socket.io'
import MessageModel from "../src/models/Message.js"

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['PUT', 'POST']
    }
})

io.on('connection', async socket => {

    await connectToDB()
    let roomID = null

    socket.on('joinRoom', id => { roomID = id })
    socket.join(roomID)

    socket.on('message', async ({ roomID: dd, messageData }) => {

        const newMessage = await MessageModel.create({
            message: messageData.message,
            sender: messageData.sender,
            roomID
        })
        console.log(newMessage)
        io.in(roomID).emit('message', newMessage)
    })

    socket.on('seen', async _id => {
        io.emit('seen', _id)
        // await MessageModel.findOneAndUpdate({ _id }, { seen: true })
    })

})