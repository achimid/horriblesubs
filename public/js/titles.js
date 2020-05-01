
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
const onSelectSubtitle = (id, magnetLink) => {
    location.href = `/api/v1/subtitle/${id}/download`
    setTimeout(() => window.open(magnetLink, "_self"), 500)
}




//  =============== FUNCTIONS ===============

const buildDivTitle = (t) => {
    return `
        <div class="box p-2 px-3 bg-light d-flex clickable" onclick="onSelectSubtitle('${t._id}', '${t.magnetLink}')">
            <div class="icon mr-3">
                <span class="icon-map-signs"></span>
            </div>
            <div> <p class="small-pad" >${t.fileName}</p> </div>
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




