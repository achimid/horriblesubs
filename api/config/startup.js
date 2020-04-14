const databaseInit = require('./database')
const { socketInit } = require('../utils/socket-util')

const init = () => {
    databaseInit()
    socketInit()
}

module.exports = init
