import { RoomModel } from "../src/models/Room.js"
import connectToDB from "../src/db/db.js"
import { Server } from 'socket.io'
import UserModel from "../src/models/User.js"

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['PUT', 'POST']
    }
})

io.on('connection', async socket => {

    await connectToDB()

    socket.on('message', async ({ roomID, messageData }) => {

        const userData = await UserModel.findOne({ _id: messageData.sender })
        await RoomModel.updateOne({ _id: roomID }, { $push: { messages: messageData } });

        io.emit('message',
            {
                ...messageData,
                sender: userData
            })
    })

})