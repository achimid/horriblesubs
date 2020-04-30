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

router.get('/evaluate', (req, res) => {
    service.getDialoguesToEvaluateSuggestions(req.query)
        .then((dialogues) => res.json({dialogues}))
})

router.put('/upvote/:suggestionId', (req, res) => {
    service.upvoteOnSuggestion(req.params.suggestionId)
        .then(() => res.status(200).send())
})

router.put('/downvote/:suggestionId', (req, res) => {
    service.downvoteOnSuggestion(req.params.suggestionId)
        .then(() => res.status(200).send())
})




module.exports = router
