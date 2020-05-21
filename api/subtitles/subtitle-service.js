const fetch = require('node-fetch')
const { onExtractionDone } = require('./subtitle-socket-client')
const SubtitleModel = require('./subtitle-model')
const NotificationService = require('../notification/notification-service')

const langsToTranslateByDefault = process.env.DEFAULT_LANGUAGES_TRANSLATION.split('|')

let cur = 0
const SERVERS = process.env.MKV_EXTRACT_API_URLS.split(',')
const PATH = process.env.MKV_EXTRACT_API_URI

const sendExtractionRequest = (body) => {

        const URL = SERVERS[(cur + 1) % SERVERS.length]
        cur = (cur + 1) % SERVERS.length
        console.log(`Enviando para extração.... ${URL}`)

        return fetch(`${URL}${PATH}`, 
            { method: 'post', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    }

const sendExtraction = (magnetLink, subtitleId) => {

    const body = { magnetLink, langsTo: langsToTranslateByDefault, ignoreCache: 'false' }
    
    return sendExtractionRequest(body)
        .then(res => res.json())
        .then(extraction => onExtractionDone(extraction, whenExtractionDone(subtitleId)))
    
}

const onNotificationRecieve = async (data) => {
    const subtileBody = JSON.parse(data.lastExecution.extractedTarget)
    subtileBody.pageUrl = subtileBody.pageUrl.split('#')[0]
    
    const { name, episode, pageUrl } = subtileBody
    console.info('Nova extraction recebida...', name, episode)

    const finded = await SubtitleModel.findOne({name, episode, pageUrl, content: { $exists: true } })
    if (finded) return Promise.resolve()

    const subtitle = new SubtitleModel(subtileBody)    
    subtitle.save()
        .then(() => sendExtraction(subtitle.magnetLink, subtitle._id))    
        .catch(() => console.info('Erro tentando salvar legenda duplicada', subtitle))
}

const whenExtractionDone = (subtitleId) => async ({body}) => {
    console.info('Evento de download completo recebido', subtitleId)
    
    const subOriginal = await SubtitleModel.findById(subtitleId)
    
    const subtitles = getAndParseSubtitlesBody(body, subOriginal)
    SubtitleModel.insertMany(subtitles)
        .then(() => console.info('Legendas salvas...'))
        .catch(() => console.error('Erro ao salvar legendas duplicadas...'))    
 
    subOriginal.remove()


    NotificationService.sendNotificationNewSubtitle(subtitles[0])
}

const getAndParseSubtitlesBody = (b, subtitle) => {

    let subtitles = b.subtitles.map(sub => {
        const subs = sub.translations.map(t => {
            return {
                name: subtitle.name,
                magnetLink: subtitle.magnetLink,
                episode: subtitle.episode,
                pageUrl: subtitle.pageUrl,
                fileName: fileNameReplaces(sub.fileName),
                content: t.content,
                language: t.to,
                dialoguesMap: t.dialoguesMap.map(m => {
                    return {
                        ...m,
                        suggestions: [{
                            text: m.translated
                        }]
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

const deleteSubtitlesUncompleted = () => {
    console.info('Removendo legendas incompletas...')
    SubtitleModel.deleteMany({content: { $exists: false}}).exec()
}

const listAvailableTitles = async (query) => {
    const titles = await SubtitleModel
        .find(query)
        .select('fileName _id magnetLink')
        .sort({ createdAt: -1 })
        .limit(20)
        .skip(parseInt(query.page || 0))
        .lean()

    return titles
}

const fileNameReplaces = (fileName) => {
    return fileName
        .replace(new RegExp('\\[HorribleSubs\\]', "ig"), '[AutoSubs]')
        .replace(new RegExp('\\.[0-9]\\.', "ig"), '.')
}

module.exports = {
    onNotificationRecieve,
    findByQuery,
    findById,
    deleteSubtitlesUncompleted,
    listAvailableTitles
}




