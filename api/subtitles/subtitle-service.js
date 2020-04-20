const fetch = require('node-fetch')
const { onExtractionDone } = require('./subtitle-socket-client')
const SubtitleModel = require('./subtitle-model')

const langsToTranslateByDefault = process.env.DEFAULT_LANGUAGES_TRANSLATION.split('|')

const getLinks = (data) => {
    return data.lastExecution.extractedContent.filter(s => (s || '').indexOf('magnet') >= 0)
}

const sendExtractionRequest = (body) => fetch(process.env.MKV_EXTRACT_API + process.env.MKV_EXTRACT_API_URI, 
    { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})

const sendExtraction = (magnetLink) => {
    console.info('Enviando para extração...')

    const body = { magnetLink, langsTo: langsToTranslateByDefault, ignoreCache: 'false' }
    sendExtractionRequest(body)
        .then(res => res.json())
        .then(extraction => onExtractionDone(extraction, whenExtractionDone))
}

const onNotificationRecieve = (data) => getLinks(data).map(sendExtraction)  

const whenExtractionDone = ({body}) => {
    console.info('Evento de download completo recebido')
    
    const subtitles = getAndParseSubtitlesBody(body)
    SubtitleModel.insertMany(subtitles)
        .then(() => console.info('Legendas salvas...'))
        .catch(() => console.error('Erro ao salvar legendas duplicadas...'))    

}

const getAndParseSubtitlesBody = (b) => {

    let subtitles = b.subtitles.map(sub => 
        sub.translations.map(t => {
            return {
                fileName: sub.fileName,
                content: t.content,
                language: t.to,
                dialoguesMap: t.dialoguesMap.map(m => {
                    return {
                        ...m,
                        sugestions: [m.translated]
                    }
                })
            }
        })
    ).flat()

    return subtitles
}

const findSubtitle = (data) => {
    console.info('Buscando legendas', data)

    const query = {
        name: data.name,
        episode: data.episode,
        magnetLink: data.magnetLink,
        pageUrl: data.pageUrl,
        fileName: data.fileName,
        language: data.language
    }

    return SubtitleModel.find(query).exec()
}

module.exports = {
    onNotificationRecieve,
    findSubtitle
}




