const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name: { type: String },
    episode: { type: String },
    magnetLink: { type: String },
    pageUrl: { type: String },
    originalContent: { type: String },
    subtitles: [{
        fileName: { type: String },
        language: { type: String },
        content: { type: String }
    }],
}, { versionKey: false, timestamps: true})

const Extraction = mongoose.model("subtitles", schema)

module.exports = Extraction

{
    name: "Naruto Shippuden"
    episode: "Episode 156"
    magnetLink: "magnetlink=?/mntx=asldajsk"
    pageUrl: "https://www.animestc.com/animes/naruto-shippuden/"
    
    
}