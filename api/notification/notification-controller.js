const router = require('express').Router()
const service = require('./notification-service')


router.post('/subscribe', (req, res) => {
    service.create(req.body)
        .then((data) => res.status(201).json(data))
        .catch(() => res.status(409).send())    
})


module.exports = router
