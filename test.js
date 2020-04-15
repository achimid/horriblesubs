const SubtitleModel = require('./api/subtitles/subtitle-model')

const data = new SubtitleModel({
    name: 'name',
    episode: 'episode 15',
    magnetLink: 'link',
    pageUrl: 'urlPage',
    fileName: 'fileName',
    language: 'language',
    content: '﻿[Script Info]\nTitle: HorribleSubs\nScriptType: v4.00+\nCollisions: Normal\nPlayDepth: 0\nWrapStyle: 0\nPlayResX: 848\nPlayResY: 480\nScaledBorderAndShadow: yes\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Open Sans Semibold,36,&H00FFFFFF,&H000000FF,&H00020713,&H00000000,-1,0,0,0,100,100,0,0,1,2.0,0,2,0,0,28,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n\nDialogue: 0,0:00:33.29,0:00:35.58,Default,,0,0,0,,Collective responsibility?',
    dialoguesMap: [{
        line: 'Dialogue: 0,0:00:33.29,0:00:35.58,Default,,0,0,0,,Collective responsibility?',
        original: 'Collective responsibility?',        
        sugestions: ['Responsabilidade coletiva?'],
        index: 0
    }]
})

data.buildContentBasedOnSugestions()

// console.log(data)