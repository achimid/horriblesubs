
// ============== ELEMENTS ==============
const $language = document.querySelector('#language')
const $suggestionsList = document.querySelector('.suggestions-list')




// ============== EVENTS ==============
$("#language").change(onChangeLanguage)




//  ============== EVENTS FUNCTIONS ==============
function onChangeLanguage() { 
    localStorage.setItem('language', $language.value)
    getTitlesFromAPI()
}

// TODO: Melhor e criar um botão para cada
const onSelectSubtitle = (id) => {
    location.href = `/api/v1/subtitle/${id}/download`
}

const onSelectLink = (magnetLink) => {
    window.open(magnetLink, "_self")
}




//  =============== FUNCTIONS ===============

const buildDivTitle = (t) => {
    return `        
        <div class="box p-2 px-3 bg-light d-flex hoverable">
            <div class="d-flex box col-10">
                <div class="icon mr-3">
                    <span class="icon-map-signs"></span>
                </div>
                <div> <p class="small-pad" ><b>${t.fileName}</b></p> </div>
            </div>
            <div class="d-flex box col-1"  onclick="onSelectSubtitle('${t._id}')">
                <button class="btn btn-outline-primary btn-sm">Subtitle</button>
            </div>
            <div class="d-flex box col-1"  onclick="onSelectLink('${t.magnetLink}')">
                <button class="btn btn-outline-primary btn-sm">Torrent</button>
            </div>
        </div>
    `
}
const getQueryParams = () => {
    return { language: localStorage.getItem('language') || $language.value || 'pt' }
}

const onReceiveTitles = (titles) => {
    $suggestionsList.innerHTML = ''
    $suggestionsList.innerHTML = titles.map(buildDivTitle).join('')
}

const getTitlesFromAPI = () => getLastTitlesReleasedAPI(getQueryParams()).then(json => onReceiveTitles(json.titles))






//  ==================== INIT =================
getTitlesFromAPI().then(() => console.log('Titles loaded'))
$language.value = localStorage.getItem('language')




