const healthcheck = require('./healthcheck')
const subtitleControler = require('../subtitles/subtitle-controller')

const prefix = process.env.API_PREFIX + process.env.API_VERSION

module.exports = (app) => {
    console.info('Registrando rotas...')

    app.use(`${prefix}`, healthcheck)
    app.use(`${prefix}/subtitle`, subtitleControler)

}