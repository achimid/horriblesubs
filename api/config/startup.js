const databaseInit = require('./database')
const { socketInit } = require('../utils/socket-util')
const { deleteSubtitlesUncompleted } = require('../subtitles/subtitle-service')

const init = () => {
    databaseInit()
    socketInit()
    deleteSubtitlesUncompleted()
}



module.exports = init
