const SERVER_URL = 'https://horriblesubs-community.herokuapp.com'
// const SERVER_URL = 'http://localhost:9002'
const SUGGESTION_URL = SERVER_URL + '/api/v1/suggestion'

const language = 'pt'
let skip = getWithExpiry('skip') || 0
let page = getWithExpiry('page') || 0

if (skip > 200) skip = 0

const getUrlSuggestion = () => `${SUGGESTION_URL}?language=${language}&skip=${skip}&page=${page}`

const dialogues = []
let current = null

const $suggestionsList = document.querySelector('.suggestions-list')
const $originalSentence = document.querySelector('.original-sentence')
const $form = document.querySelector('form')
const $suggestionTextArea = document.querySelector('#suggestion')

const getDivSuggestions = (d) => {
    return (d.suggestions || [])
        .sort((a, b) => (b.upVote || 0) - (a.upVote || 0))
        .map((sug, index) => `
            <div class="col-md-12 ftco-animate special-col">
                <div class="box p-2 px-3 bg-light d-flex clickable" onclick="selectSuggestion(event, '${sug._id}')">
                    <div class="icon mr-3">
                        <span class="icon-map-signs"></span>
                    </div>
                    <div>
                        <h3 class="mb-3">Suggestion ${parseInt(index) + 1}</h3>
                        <b class="small small-pad">${d.original}</b>
                        <p class="small-pad" id="suggestion-text">${sug.text}</p>
                    </div>
                </div>
            </div>  

        `).join('')
}

const getDialoguesFromAPI = () => {
    return fetch(getUrlSuggestion())
        .then(data => data.json())
        .then(json => {
            if (json.dialogues.length == 0) {
                page = 0
                skip++

                if (skip > 200) skip = 0

                setWithExpiry('page', page, 3600000 * 2) // 2 horas
                setWithExpiry('skip', skip, 3600000 * 2) // 2 horas

                return getDialoguesFromAPI()
            }

            dialogues.push(...json.dialogues)
            page++
            
            setWithExpiry('page', page, 3600000 * 2) // 2 horas
        })
}

const renderNextDialogue = (d = dialogues.shift()) => {

    if (!dialogues.length) getDialoguesFromAPI()

    current = d

    $suggestionsList.innerHTML = getDivSuggestions(d)
    
    if ($originalSentence) {
        $originalSentence.innerHTML = `${d.original}`
        $suggestionTextArea.value = ''
    }

    contentWayPoint()
}

const onSubmitForm = (event) => {
    event.preventDefault()
    if (!$suggestionTextArea.value) return
    
    const suggestionValue = $suggestionTextArea.value
    current.suggestions.push({ text: suggestionValue })
    renderNextDialogue(current)
    
    sendNewSuggestionToAPI(current._id, suggestionValue)

    $suggestionTextArea.value = ''
}

const sendNewSuggestionToAPI = (id, suggestion) => {
    const body = { suggestion }
    fetch(SUGGESTION_URL + '/' + id, 
        { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
        .then(() => { setTimeout(renderNextDialogue, 250) })
        .catch(console.error)
}

function selectSuggestion(event, suggestionId) {
    if ($suggestionTextArea) {
        $suggestionTextArea.value = event.target.parentNode.querySelector('p').textContent
    } else {
        upVote(suggestionId)
        renderNextDialogue()
    }
}

const upVote = (suggestionId) => fetch(SUGGESTION_URL + '/upvote/' + suggestionId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})

const downVote = (suggestionId) => fetch(SUGGESTION_URL + '/downvote/' + suggestionId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})


getDialoguesFromAPI().then(() => renderNextDialogue())    


function setWithExpiry(key, value, ttl) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.getTime() + ttl
    }
    localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)

    // if the item doesn't exist, return null
    if (!itemStr) {
        return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
    }
    return item.value
}


$('#suggestion').keydown(function (e) {
    if (e.ctrlKey && e.keyCode == 13) {
      $('form').submit()
    }
});