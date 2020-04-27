const fetch = require('node-fetch')
const { onExtractionDone } = require('./subtitle-socket-client')
const PQueue = require('../utils/promise-queue')
const SubtitleModel = require('./subtitle-model')

const langsToTranslateByDefault = process.env.DEFAULT_LANGUAGES_TRANSLATION.split('|')

const sendExtractionRequest = (body) => {
        console.info('Enviando para extração...')

        return fetch(process.env.MKV_EXTRACT_API + process.env.MKV_EXTRACT_API_URI, 
        { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    }

const sendExtraction = (magnetLink, subtitleId) => {
    console.info('Enfileirando para extração...')

    const body = { magnetLink, langsTo: langsToTranslateByDefault, ignoreCache: 'true' }
    
    const promiseSend = () => {
        return sendExtractionRequest(body)
            .then(res => res.json())
            .then(extraction => onExtractionDone(extraction, whenExtractionDone(subtitleId)))
    }
    PQueue.push(promiseSend)
}

const onNotificationRecieve = async (data) => {
    const subtileBody = JSON.parse(data.lastExecution.extractedTarget)
    subtileBody.pageUrl = subtileBody.pageUrl.split('#')[0]
    
    const { name, episode, pageUrl } = subtileBody
    const finded = await SubtitleModel.findOne({name, episode, pageUrl, content: { $exists: true } })
    if (finded) return Promise.resolve()

    const subtitle = new SubtitleModel(subtileBody)    
    subtitle.save()
        .then(() => sendExtraction(subtitle.magnetLink, subtitle._id))    
        .catch(() => console.info('Erro tentando salvar legenda duplicada', subtitle))
}

const whenExtractionDone = (subtitleId) => async ({body}) => {
    console.info('Evento de download completo recebido', subtitleId)
    
    // Chamada para executar a proxima extração enfileirada
    PQueue.execNext()

    const subOriginal = await SubtitleModel.findById(subtitleId)
    
    const subtitles = getAndParseSubtitlesBody(body, subOriginal)
    SubtitleModel.insertMany(subtitles)
        .then(() => console.info('Legendas salvas...'))
        .catch(() => console.error('Erro ao salvar legendas duplicadas...'))    

    subOriginal.remove()

}

const getAndParseSubtitlesBody = (b, subtitle) => {

    let subtitles = b.subtitles.map(sub => {
        const subs = sub.translations.map(t => {
            return {
                name: subtitle.name,
                magnetLink: subtitle.magnetLink,
                episode: subtitle.episode,
                pageUrl: subtitle.pageUrl,
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

        const originalSub = JSON.parse(JSON.stringify(subs[0]))
        originalSub.content = sub.fileContent
        originalSub.language = b.langFrom || 'en'
        delete originalSub.dialoguesMap

        subs.push(originalSub)   
        return subs
    }).flat()

    return subtitles
}

const findByQuery = (data) => {
    const query = {
        _id: data._id,
        name: data.name,
        episode: data.episode,
        magnetLink: data.magnetLink,
        pageUrl: {
            $in: [data.pageUrl, data.pageUrl.split('#')[0]]
        },
        fileName: data.fileName,
        language: { $exists: true } 
    }

    Object.keys(query).forEach((key) => (query[key] == null) && delete query[key])

    return SubtitleModel.find(query).select('episode language name').sort('name episode language').lean()
}

const findById = (id) => SubtitleModel.findById(id).select('episode language name content fileName').lean()

module.exports = {
    onNotificationRecieve,
    findByQuery,
    findById
}




