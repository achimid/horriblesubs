const server_url = process.env.KEEP_UP != 'false' ? process.env.MKV_EXTRACT_API : ''
const socket = require('socket.io-client')(server_url, { transports: ['websocket'] })

socket.on('reconnect_attempt', () => { socket.io.opts.transports = ['websocket']})

socket.on('connect', () => console.info('Socket conectado ao servidor'))

socket.on('disconnect', () => console.info('Socket desconectado do servidor'))

const onExtractionDone = (EXTRACTION_ID, callback) => socket.on(`${EXTRACTION_ID}_DONE`, callback)

module.exports = {
    onExtractionDone
}