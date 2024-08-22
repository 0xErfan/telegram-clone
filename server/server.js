import connectToDB from "../src/db/db.js"
import { Server } from 'socket.io'
import RoomModel from "../src/models/Room.js"

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['PUT', 'POST']
    }
})

await connectToDB()

io.of('/getRooms').on('connection', socket => {

    socket.on('getRooms', async userID => {

        const userRooms = await RoomModel.find({ participants: { $in: userID } })

        const updatedRooms = []

        for (const room of userRooms) {
            updatedRooms.push(
                {
                    ...room,
                    messages: room.messages?.length ? room.messages[room.messages.length] : []
                })
        }
        console.log(updatedRooms)

        socket.emit('getRooms', updatedRooms)
    })

})