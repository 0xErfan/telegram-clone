const Socket = require("socket.io")

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        method: ['PUT', 'POST']
    }
})

io.on('connection', (socket: typeof Socket) => {

    io.emit('hello', 'new user connected')

    socket.on('message', (data: unknown) => {
        io.emit('message', data)
    })

})