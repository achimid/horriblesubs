const databaseInit = require('./database')
const { registerSocketEvents } = require('../utils/socket-util')
const { deleteSubtitlesUncompleted } = require('../subtitles/subtitle-service')

const init = () => {
    databaseInit()
    // registerSocketEvents()
    deleteSubtitlesUncompleted()
}



module.exports = init
