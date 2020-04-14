const server_url = process.env.KEEP_UP != 'false' ? process.env.MKV_EXTRACT_API : ''
const socket = require('socket.io-client')(server_url, { transports: ['websocket'] })

socket.on('reconnect_attempt', () => { socket.io.opts.transports = ['websocket']})

socket.on('connect', () => console.info('Socket conectado ao servidor'))

socket.on('disconnect', () => console.info('Socket desconectado do servidor'))

const onExtractionDone = (extraction, callback) => {
    const {_id, subtitles} = extraction
    if (subtitles && subtitles.length > 0) {
        callback({body: extraction})
    } else if (_id) {
        socket.on(`${_id}_DONE`, callback)
    }
}

module.exports = {
    onExtractionDone
}