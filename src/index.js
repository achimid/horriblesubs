require('dotenv').config()

const maxAge = process.env.NODE_ENV == 'production' ? 7*86400000 : 0

const cors = require('cors')
const express = require('express')
const compression = require('compression')
const app = express()

const server = require('http').createServer(app)
global.socket = require('socket.io')(server)

const routes = require('./config/routes')
const statup = require('./config/startup')

app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.static('public', { maxAge, extensions:['html'] }))

app.disable('x-powered-by')

routes(app)
statup()

server.listen(process.env.PORT)