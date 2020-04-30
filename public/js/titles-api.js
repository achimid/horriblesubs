// const SERVER_URL = 'https://horriblesubs-community.herokuapp.com'
const SERVER_URL = 'http://localhost:9002'
const TITLES_URL = SERVER_URL + '/api/v1/subtitle/titles'


const $language = document.querySelector('#language')
const $suggestionsList = document.querySelector('.suggestions-list')

const getUrlSuggestion = () => `${TITLES_URL}?language=${localStorage.getItem('language') || $language.value || 'pt'}`

const getTitleHtml = (t) => {
    return `
        <div class="box p-2 px-3 bg-light d-flex clickable" onclick="selectSubtitle('${t._id}', '${t.magnetLink}')">
            <div class="icon mr-3">
                <span class="icon-map-signs"></span>
            </div>
            <div> <p class="small-pad" >${t.fileName}</p> </div>
        </div>
    `
}

const getTitlesFromAPI = () => {
    return fetch(getUrlSuggestion())
        .then(data => data.json())
        .then(json => {
            $suggestionsList.innerHTML = ''
            const htmlInject = json.titles.map(getTitleHtml).join('')
            $suggestionsList.innerHTML = htmlInject
        })
}

$("#language").change(function() { 
    localStorage.setItem('language', $language.value);  
    getTitlesFromAPI();
})
$language.value = localStorage.getItem('language')


getTitlesFromAPI().then(() => console.log('titles loaded'))

const selectSubtitle = (id, magnetLink) => {
    location.href = `/api/v1/subtitle/${id}/download`
    setTimeout(() => window.open(magnetLink, "_self"), 500)
}
