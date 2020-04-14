const fetch = require('node-fetch')
const { onExtractionDone } = require('./subtitle-socket-client')

const getLinks = (data) => {
    return data.lastExecution.extractedContent.filter(s => (s || '').indexOf('magnet') >= 0)
}

const sendExtractionRequest = (body) => fetch(process.env.MKV_EXTRACT_API + '/api/v1/extract', 
    { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})

const sendExtraction = (magnetLink) => {
    console.info('Enviando para extração...')

    const body = { magnetLink, langTo: "pt", ignoreCache: false }
    sendExtractionRequest(body)
        .then(res => res.json())
        .then(extraction => onExtractionDone(extraction, whenExtractionDone))
}

const onNotificationRecieve = (data) => getLinks(data).map(sendExtraction)  

const whenExtractionDone = ({body}) => {
    console.info('Evento de download completo recebido')
    // TODO: Salvar as legendas traduzidas
}

module.exports = {
    onNotificationRecieve
}