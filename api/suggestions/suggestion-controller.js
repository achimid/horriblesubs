const router = require('express').Router()
const service = require('./suggestion-service')

router.put('/:dialogueId', async (req, res) => {        
    service.addSuggestion(req.params.dialogueId, req.body)
        .then((suggestions) => res.json({suggestions}))
})

router.get('/', (req, res) => {        
    service.getDialoguesToImproveSuggestions(req.query)
        .then((dialogues) => res.json({dialogues}))
})



module.exports = router
