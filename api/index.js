require('dotenv').config()

const express = require('express')
const compression = require('compression')
const app = express()

const server = require('http').createServer(app)
global.socket = require('socket.io')(server)

const routes = require('./config/routes')
const statup = require('./config/startup')

app.use(compression())
app.use(express.json())

routes(app)
statup()

server.listen(process.env.PORT)