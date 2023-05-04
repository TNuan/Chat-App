const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose') 
const userRoutes = require('./routes/userRoutes')
const messageRoute = require('./routes/messageRoute')
const app = express()
const socket = require('socket.io') 

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/message', messageRoute)

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB Connection Successfull !!!!')
    })
    .catch(err => {
        console.error(err.message)
    })

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`)
})

const io = socket(server, {
    cors: {
        origin: '*',
        credential: true,
    }
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {
    global.chatSocket = socket
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id)
        // console.log('a user ' + userId + ' is online')
    })

    socket.on('send-msg', (data) => { 
        const sendUserSocket = onlineUsers.get(data.to)
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data)
        }
    })

    socket.on('update-message', (data) => {
        const updateUserSoket = onlineUsers.get(data.to)
        if (updateUserSoket) {
            socket.to(updateUserSoket).emit('msg-recieve', data)
        }
    })
})
