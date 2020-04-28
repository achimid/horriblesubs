const SERVER_URL = 'https://horriblesubs-community.herokuapp.com'
// const SERVER_URL = 'http://localhost:9002'
const SUGGESTION_URL = SERVER_URL + '/api/v1/sugestion'

const language = 'pt'
let skip = 0
let page = 0

const getUrlSuggestion = () => `${SUGGESTION_URL}?language=${language}&skip=${skip}&page=${page}`

const dialogues = []
let current = null

const $suggestionsList = document.querySelector('.suggestions-list')
const $originalSentence = document.querySelector('.original-sentence')
const $form = document.querySelector('form')
const $suggestionTextArea = document.querySelector('#suggestion')

const getDivSuggestions = (d) => {
    return d.sugestions.map((sug, index) => `
        <div class="col-md-12 ftco-animate special-col">
            <div class="box p-2 px-3 bg-light d-flex">
                <div class="icon mr-3">
                    <span class="icon-map-signs"></span>
                </div>
                <div>
                    <h3 class="mb-3">Suggestion ${parseInt(index)}</h3>
                    <b class="small small-pad">${d.original}</b>
                    <p class="small-pad">${sug}</p>
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
                return getDialoguesFromAPI()
            }

            dialogues.push(...json.dialogues)
            page++
        })
}

const renderNextDialogue = (d = dialogues.pop()) => {

    if (!dialogues.length) getDialoguesFromAPI()

    current = d

    $suggestionsList.innerHTML = getDivSuggestions(d)
    $originalSentence.innerHTML = `"${d.original}"`

    contentWayPoint()
}

const onSubmitForm = (event) => {
    event.preventDefault()
    if (!$suggestionTextArea.value) return
    
    current.sugestions.push($suggestionTextArea.value)
    renderNextDialogue(current)
    
    sendNewSuggestionToAPI(current._id, $suggestionTextArea.value)

    $suggestionTextArea.value = ''
}

const sendNewSuggestionToAPI = (id, sugestion) => {
    const body = { sugestion }
    fetch(SUGGESTION_URL + '/' + id, 
        { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
        .then(() => { setTimeout(renderNextDialogue, 250) })
        .catch(console.error)
}



getDialoguesFromAPI()
    .then(() => renderNextDialogue())    


