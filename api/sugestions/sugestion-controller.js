const router = require('express').Router()
const service = require('./sugestion-service')

router.put('/:dialogueId', async (req, res) => {        
    service.addSugestion(req.params.dialogueId, req.body)
        .then((sugestions) => res.status(200).json({sugestions}))
})

module.exports = router
