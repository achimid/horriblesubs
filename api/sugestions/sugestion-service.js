const SubtitleModel = require('../subtitles/subtitle-model')

const addSugestion = async (dialogueId, { sugestion }) => {
    console.time('sugestion-add-time')

    const subtitle = await SubtitleModel.findOne({'dialoguesMap._id': dialogueId})
    const dialogue = subtitle.dialoguesMap.filter(({_id}) => _id == dialogueId)[0]
    const sugestions = dialogue.sugestions

    // Adiciona a sugestão
    sugestions.unshift(sugestion)
    dialogue.sugestions = [...(new Set(sugestions))]

    // Build do conteudo
    subtitle.buildContentBasedOnSugestions()

    // Persiste na base
    await subtitle.save()

    console.timeEnd('sugestion-add-time')   

    return Promise.resolve(dialogue.sugestions)
}

module.exports = {
    addSugestion
}