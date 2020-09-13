const server_url = process.env.KEEP_UP != 'false' ? process.env.MKV_EXTRACT_API_URLS : ''

const sockets = server_url.split(',').map(server_url => {
    const socket = require('socket.io-client')(server_url, { transports: ['websocket'] })

    socket.on('reconnect_attempt', () => { socket.io.opts.transports = ['websocket']})
    socket.on('connect', () => console.info('Socket conectado ao servidor'))
    socket.on('disconnect', () => console.info('Socket desconectado do servidor'))

    return socket
})

const onExtractionDone = (extraction, callback) => {
    const {_id, subtitles} = extraction
    if (subtitles && subtitles.length > 0) {
        callback({body: extraction})
    } else if (_id) {
        sockets.map(socket => {
            socket.on(`${_id}_DONE`, (data) => { 
                callback(data)
                socket.off(`${_id}_DONE`)
            })
        })        
    }
}

module.exports = {
    onExtractionDone
}