const healthcheck = require('./healthcheck')
const subtitleController = require('../subtitles/subtitle-controller')
const suggestionController = require('../suggestions/suggestion-controller')
const notificationController = require('../notification/notification-controller')

const prefix = process.env.API_PREFIX + process.env.API_VERSION

module.exports = (app) => {
    console.info('Registrando rotas...')

    app.use(`${prefix}`, healthcheck)
    app.use(`${prefix}/subtitle`, subtitleController)
    app.use(`${prefix}/suggestion`, suggestionController)
    app.use(`${prefix}/notification`, notificationController)

}