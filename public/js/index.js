
// ============== ELEMENTS ==============
const $language = document.querySelector('#language')
const $suggestionsList = document.querySelector('.suggestions-list')
const $originalSentence = document.querySelector('.original-sentence')
const $form = document.querySelector('form')
const $suggestionTextArea = document.querySelector('#suggestion')

$language.value = localStorage.getItem('language')


// ============== EVENTS ==============
$('#suggestion').keydown(onKeyDownSuggestion)
$("#language").change(onChangeLanguage)
$("form").submit(onSubmitForm)
$(".btn-next-dialogue").click(onSelectNext)




//  ============== EVENTS FUNCTIONS ==============
function onKeyDownSuggestion (e) {
    if (e.ctrlKey && e.keyCode == 13) {
      $('form').submit()
    }
}

function onChangeLanguage() { 
    localStorage.setItem('language', $language.value)
    dialogues = []
    getDialogues().then(() => renderNextDialogue())    
}

function onSubmitForm (event) {
    event.preventDefault()
    if (!$suggestionTextArea.value) return
    
    const suggestionValue = $suggestionTextArea.value
    const objSuggestion = { text: suggestionValue }
    current.suggestions.push(objSuggestion)
    renderNextDialogue(current)
    
    sendNewSuggestionAPI(current._id, objSuggestion).then(() => { setTimeout(renderNextDialogue, 250) })

    $suggestionTextArea.value = ''
}

function onSelectSuggestion(event) {
    $suggestionTextArea.value = event.target.parentNode.querySelector('p').textContent
}

function onSelectNext() {
    renderNextDialogue()
}




//  =============== VARIABLES ===============
const TWO_HOURS = 3600000 * 2

let skip = getWithExpiry('skip') || 0
let page = getWithExpiry('page') || 0
let dialogues = []
let current = null

if (skip > 200) skip = 0





//  =============== FUNCTIONS ===============

const getQueryParams = () => {
    return {
        language: localStorage.getItem('language') || $language.value || 'pt',
        skip,
        page
    }
}

const buildDivSuggestion = (d, sug, index) => {
    return `
        <div class="col-md-12 ftco-animate special-col">
            <div class="box p-2 px-3 bg-light d-flex clickable btn-select-suggestion" onclick="onSelectSuggestion(event)">
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
    `
}

const buildBlockSuggestions = (d) => {
    return (d.suggestions || [])
        .sort((a, b) => (b.upVote || 0) - (a.upVote || 0))
        .map((sug, index) => buildDivSuggestion(d, sug, index) ).join('')
}

const getDialogues = () => getDialoguesToSuggestionAPI(getQueryParams()).then(onReceiveDialogues)


const onReceiveDialogues = (json) => {
    if (json.dialogues.length == 0) {
        page = 0
        skip++

        if (skip > 200) skip = 0

        setWithExpiry('page', page, TWO_HOURS)
        setWithExpiry('skip', skip, TWO_HOURS)

        return getDialogues()
    }

    dialogues.push(...json.dialogues)
    page++
    
    setWithExpiry('page', page, TWO_HOURS)
}


const renderNextDialogue = (d = dialogues.shift()) => {
    if (!dialogues.length) getDialogues()

    current = d
    $suggestionsList.innerHTML = buildBlockSuggestions(d)
        
    $originalSentence.innerHTML = `${d.original}`
    $suggestionTextArea.value = ''    

    contentWayPoint()
}





//  ==================== INIT =================
getDialogues().then(() => renderNextDialogue())    




