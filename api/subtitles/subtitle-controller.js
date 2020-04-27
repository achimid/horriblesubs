const router = require('express').Router()
const service = require('./subtitle-service')

router.post('/receive', async (req, res) => {    
    service.onNotificationRecieve(req.body)
    res.status(200).send()
})

router.get('/', async (req, res) => {
    console.info('Buscando legendas...', req.query)
    service.findByQuery(req.query)
        .then(subtitles => res.json({subtitles}))
})

router.get('/:id/download', async (req, res) => {    
    service.findById(req.params.id)
        .then(sub => {
            console.info('Downloading...', sub.fileName)
            res.setHeader('Content-type', "application/octet-stream")
            res.setHeader('Content-disposition', 'attachment; filename=' + global.encodeURIComponent(sub.fileName))
            res.send(sub.content);
        })    
})

module.exports = router
