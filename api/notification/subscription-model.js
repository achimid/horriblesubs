const mongoose = require("mongoose")

const schema = mongoose.Schema({}, { timestamps: true, strict: false, versionKey: false })

schema.index({ endpoint: 1 }, { unique: true, background: true, dropDups: true })

const Subscription = mongoose.model("subscriptions", schema)  
module.exports = Subscription