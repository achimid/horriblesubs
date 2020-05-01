
// ============== ELEMENTS ==============
const $suggestionsList = document.querySelector('.suggestions-list')
const $language = document.querySelector('#language')



// ============== EVENTS ==============
$("#language").change(onChangeLanguage)



//  ============== EVENTS FUNCTIONS ==============
function onChangeLanguage() { 
    localStorage.setItem('language', $language.value)
    dialogues = []
    getDialoguesFromAPI().then(() => renderNextDialogue())
}


function onSelectSuggestion(suggestionId) {
    upVoteAPI(suggestionId)
    renderNextDialogue()    
}





//  =============== VARIABLES ===============
const TWO_HOURS = 3600000 * 2

let page = getWithExpiry('page-evaluate') || 0
let dialogues = []
let current = null





//  =============== FUNCTIONS ===============

const buildDivSuggestion = (d, sug, index) => {
    return `
        <div class="col-md-12 ftco-animate special-col">
            <div class="box p-2 px-3 bg-light d-flex clickable" onclick="onSelectSuggestion('${sug._id}')">
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

const buildDivSuggestionThanks = () => {
    return `
        <div class="row justify-content-center mb-5 pb-3">
            <div class="col-md-7 text-center heading-section heading-section-white ftco-animate fadeInUp ftco-animated">                    
                <h2 class="mb-4">Thanks</h2>
            </div>
        </div>
    `
}

const buildBlockSuggestions = (d) => {
    return (d.suggestions || [])
        .sort((a, b) => (b.upVote || 0) - (a.upVote || 0))
        .map((sug, index) => buildDivSuggestion(d, sug, index)).join('')
}


const getQueryParams = () => {
    return {
        language: localStorage.getItem('language') || $language.value || 'pt',
        page
    }
}

const getDialoguesFromAPI = () => getDialoguesSuggestionToEvaluateAPI(getQueryParams()).then(json => onReceiveDialogues(json))

const onReceiveDialogues = (json) => {
    if (json.dialogues.length == 0) {
        page = 0
        setWithExpiry('page-evaluate', page, TWO_HOURS)

        $suggestionsList.innerHTML = buildDivSuggestionThanks()
        
        throw "Nada para avaliar"
    }

    dialogues.push(...json.dialogues)
    page++
    
    setWithExpiry('page-evaluate', page, TWO_HOURS)
}


const renderNextDialogue = () => {
    if (!dialogues.length) getDialoguesFromAPI()
    
    current = dialogues.shift()
    $suggestionsList.innerHTML = buildBlockSuggestions(current)

    contentWayPoint()
}






//  ==================== INIT =================
getDialoguesFromAPI().then(() => renderNextDialogue())    
$language.value = localStorage.getItem('language')








