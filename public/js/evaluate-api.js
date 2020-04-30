// const SERVER_URL = 'https://horriblesubs-community.herokuapp.com'
const SERVER_URL = 'http://localhost:9002'
const SUGGESTION_URL = SERVER_URL + '/api/v1/suggestion'
const SUGGESTION_EVALUATE_URL = SERVER_URL + '/api/v1/suggestion/evaluate'

const language = 'pt'
let page = getWithExpiry('page-evaluate') || 0

const getUrlSuggestion = () => `${SUGGESTION_EVALUATE_URL}?language=${language}&page=${page}`

const dialogues = []
let current = null

const $suggestionsList = document.querySelector('.suggestions-list')

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
                setWithExpiry('page-evaluate', page, 3600000 * 2) // 2 horas

                $suggestionsList.innerHTML = `
                    <div class="row justify-content-center mb-5 pb-3">
                        <div class="col-md-7 text-center heading-section heading-section-white ftco-animate fadeInUp ftco-animated">                    
                            <h2 class="mb-4">Thanks</h2>
                        </div>
                    </div>
                `
                
                throw "Nada para avaliar"
            }

            dialogues.push(...json.dialogues)
            page++
            
            setWithExpiry('page-evaluate', page, 3600000 * 2) // 2 horas
        })
}

const renderNextDialogue = (d = dialogues.shift()) => {

    if (!dialogues.length) getDialoguesFromAPI()

    current = d

    $suggestionsList.innerHTML = getDivSuggestions(d)    

    contentWayPoint()
}


function selectSuggestion(event, suggestionId) {
    upVote(suggestionId)
    renderNextDialogue()    
}

const upVote = (suggestionId) => fetch(SUGGESTION_URL + '/upvote/' + suggestionId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})


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