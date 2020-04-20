
const getHtmlInject = () => {
    return `
        <div class="rls-link" class="04-subs" data-epi="#nEpi#">
            <span class="rls-link-label">Subtitles:</span>
            <span class="dl-type">
                <a title="Download English Subtitle - Original" href="#">
                    English
                </a>
            </span>|
            <span class="dl-type">
                <a title="Download Portuguese Subtitle - * Automatically translated (May have several mistakes)" href="#">
                    Portuguese (*)
                </a>
            </span>|
            <span class="dl-type">
                <a title="Download Spanish Subtitle - * Automatically translated (May have several mistakes)" href="#">
                    Spanish (*)
                </a>
            </span>|
            <span class="dl-type">
                <a title="Download French Subtitle - * Automatically translated (May have several mistakes)" href="#">
                    French (*)
                </a>
            </span>|
            <span class="dl-type">
                <a title="Download Others Subtitle - * Automatically translated (May have several mistakes)" href="#">
                    Others (*)
                </a>
            </span>
        </div>`
}

const getSubtitlesFromAPI = () => {
    const apiUrl = new URL('http://localhost:9002/api/v1')
    const params = {
        url: window.location.toString().split('#')[0]
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(apiUrl)
        .then(data => data.json())
        .then((data) => setTimeout(loadSubtitles(data), 2000))
}

const loadSubtitles = (data) => () => {
    debugger
    console.log(data)

    // [...document.querySelectorAll('.rls-links-container')].map(el => {
    //     el.innerHTML = el.innerHTML + htmlInject.replace('#nEpi#', el.parentNode.querySelector('strong').textContent)
    // })    
}


getSubtitlesFromAPI()