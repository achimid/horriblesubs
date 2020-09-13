const config = require('../config/database-config')
const mongoose = require('../config/mongoose-multi-db')

const schema = mongoose.Schema({}, { timestamps: true, strict: false, versionKey: false })

schema.index({ endpoint: 1 }, { unique: true, background: true, dropDups: true })

module.exports = mongoose.model('subscriptions', schema, config)