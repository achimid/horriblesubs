const SubtitleModel = require('../subtitles/subtitle-model')

const addSuggestion = async (dialogueId, { suggestion }) => {
    console.info('Adicionando nova sugestão')

    const subtitle = await SubtitleModel.findOne({'dialoguesMap._id': dialogueId})
    const dialogue = subtitle.dialoguesMap.filter(({_id}) => _id == dialogueId)[0]
    const suggestions = dialogue.suggestions

    // Adiciona a sugestão
    suggestions.unshift({ text: suggestion })
    dialogue.suggestions = [...(new Set(suggestions))]

    // Build do conteudo
    subtitle.buildContentBasedOnSuggestions()

    // Persiste na base
    await subtitle.save()

    return Promise.resolve(dialogue.suggestions)
}

const getDialoguesToImproveSuggestions = async ({language, page, skip = 0 }) => {
    console.info('Buscando legenda para sugerir', {language, page, skip})

    const subtitle = await SubtitleModel
        .find({language}, { dialoguesMap: { $slice: getPage(page)} })
        .select('dialoguesMap.original dialoguesMap.suggestions dialoguesMap._id')
        .sort({ createdAt: -1 })
        .limit(1)
        .skip(parseInt(skip))
        .lean()
    
    const dialogues = subtitle.length ? subtitle[0].dialoguesMap : []

    return Promise.resolve(dialogues)
}

const getDialoguesToEvaluateSuggestions = async ({language, page = 0 }) => {
    console.info('Buscando legenda para avaliar sugestões', {language, page})

    const subtitle = await SubtitleModel
        .aggregate([
            { $match: {language, 'dialoguesMap.suggestions.1': { $exists: true}}},
            { $unwind: '$dialoguesMap'},
            { $match: {'dialoguesMap.suggestions.1': { $exists: true}}},
            { $project: {dialoguesMap: {original: true, suggestions: true, _id: true}}},
            { $sort: { createdAt: -1 }},
            { $skip: parseInt(page) * 20},
            { $limit: 20}
        ])

    const dialogues = subtitle.length ? subtitle.map(s => s.dialoguesMap) : []

    return Promise.resolve(dialogues)
}

const getPage = (page = 0) => [0 + (page * 20), 20 + (page * 20)]

// TODO: melhorar essa maneira de incrementar a votação, pode ter problema de concorrencia e performance
const upvoteOnSuggestion = async (suggestionId) => {

    console.time('upvote')

    const subtitle = await SubtitleModel.findOne({'dialoguesMap.suggestions._id': suggestionId})
    const suggestion = subtitle.dialoguesMap.map(d => d.suggestions.filter(s => s.id == suggestionId)).flat()[0]

    suggestion.upVote++

    await subtitle.save()    

    console.timeEnd('upvote')
}

// TODO: melhorar essa maneira de incrementar a votação, pode ter problema de concorrencia e performance
const downvoteOnSuggestion = async (suggestionId) => {

    console.time('downvote')

    const subtitle = await SubtitleModel.findOne({'dialoguesMap.suggestions._id': suggestionId})
    const suggestion = subtitle.dialoguesMap.map(d => d.suggestions.filter(s => s.id == suggestionId)).flat()[0]

    suggestion.upVote--

    await subtitle.save()    

    console.timeEnd('downvote')
}



module.exports = {
    addSuggestion,
    getDialoguesToImproveSuggestions,
    upvoteOnSuggestion,
    downvoteOnSuggestion,
    getDialoguesToEvaluateSuggestions
}