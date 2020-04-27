const router = require('express').Router()
const service = require('./sugestion-service')

router.put('/:dialogueId', async (req, res) => {        
    service.addSugestion(req.params.dialogueId, req.body)
        .then((sugestions) => res.json({sugestions}))
})

router.get('/', async (req, res) => {        
    service.getDialoguesToImproveSugestions(req.query)
        .then((subtitle) => res.json(subtitle))
})



module.exports = router
