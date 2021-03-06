const os = require('os')
const config = require('../config/database-config')
const mongoose = require('../config/mongoose-multi-db')

const LINE_SEPARATOR = os.EOL
const SUBTITLE_PART = 9

const schema = mongoose.Schema({
    name: { type: String },
    episode: { type: String },
    magnetLink: { type: String },
    pageUrl: { type: String },    
    fileName: { type: String },
    language: { type: String },
    content: { type: String },
    dialoguesMap: [{
        line: { type: String },
        original: { type: String },        
        suggestions: [{ 
            text: { type: String },
            upVote: { type: Number, default: 0 }
        }],
        index: { type: Number}
    }]
}, { versionKey: false, timestamps: true})

schema.methods.buildContentBasedOnSuggestions = function() {
    console.time('time_to_build_content')

    const lines = this.content.split(LINE_SEPARATOR)    
    const contentEdited = getEditedFileContent(lines, this.dialoguesMap).join(LINE_SEPARATOR)

    this.content = contentEdited

    console.timeEnd('time_to_build_content')
}

function getEditedFileContent(lines, dialoguesMap) {
    return lines.map(line => {
        const finded = dialoguesMap.filter(m => m.line === line)
        const hasLineTranslated = finded.length > 0

        if (!hasLineTranslated) return line
        
        const firstTranslation = finded[0]
        const firstSuggestion = firstTranslation.suggestions.length > 0 ? firstTranslation.suggestions[0].text : firstTranslation.original

        return replaceLastPart(firstSuggestion, firstTranslation.line)
    })
}

function replaceLastPart(newPart, string) {
    const parts = string.split(',')

    if (parts === -1) return string
        
    const primeiraPart = parts.splice(0, SUBTITLE_PART).join(',')
    return primeiraPart + ',' + newPart
}


module.exports = mongoose.model('subtitles', schema, config)