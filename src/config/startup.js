// const { registerSocketEvents } = require('../utils/socket-util')
const { deleteSubtitlesUncompleted } = require('../subtitles/subtitle-service')

const init = () => {    
    // registerSocketEvents()
    deleteSubtitlesUncompleted()
}



module.exports = init
