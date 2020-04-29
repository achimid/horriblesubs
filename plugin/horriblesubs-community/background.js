const SERVER_URL = 'https://horriblesubs-community.herokuapp.com'
// const SERVER_URL = 'http://localhost:9002'
// const SERVER_URL = ''
const SUBTITLES_URL = SERVER_URL + '/api/v1/subtitle'
const RECEIVE_SUBTITLES_URL = SERVER_URL + '/api/v1/subtitle/receive'

const getSpanSubtitle = (lang, id) => {
    const url = `${SUBTITLES_URL}/${id}/download`
    const message = lang == 'en' ? 'Subtitle - Original' : 'Subtitle - * Automatically translated (May have several mistakes)'
    const mark = lang == 'en' ? '' : '(*)'
    const language = languages[lang]

    return `
        <span class="dl-type">
            <a title="Download ${language} ${message}" href="${url}">
                ${capitalize(lang)} ${mark}
            </a>
        </span>
    `
}

const getDivSubtitles = (content) => {
    return `
        <div class="rls-link" class="04-subs" data-epi="#nEpi#">
            <span class="rls-link-label">Subtitles:</span>
           ${content}
        </div>`
}

const getSubtitlesFromAPI = async () => {

    const apiUrl = new URL(SUBTITLES_URL)
    const params = {
        pageUrl: window.location.toString()
    }

    Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]))

    fetch(apiUrl)
        .then(data => data.json())
        .then((data) => data.subtitles.length > 0 ? setTimeout(loadSubtitles(data), 1500) : null)
}

const loadSubtitles = (body) => () => {
    console.log(body)
    const subtitleGrouped = groupBy(body.subtitles, (s) => s.episode)
    const divsEpisodes = [...document.querySelectorAll('.rls-links-container')]

    Object.keys(subtitleGrouped).map(episode => {
        const divs = divsEpisodes.filter(el => el.parentNode.querySelector('strong').textContent == episode)
        if (divs && divs.length > 0) {
            const el = divs[0]
            const spans = subtitleGrouped[episode].map(sub => getSpanSubtitle(sub.language, sub._id))
            el.innerHTML = el.innerHTML + getDivSubtitles(spans.join('|'))
        }
    })
}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const receiveNewUrls = async () => {
    document.querySelector('.more-button').click()
    setTimeout(function() {
        const name = document.querySelector('.entry-title').textContent
        const pageUrl = location.href;

        [...document.querySelectorAll('.rls-label')].map(el => {
            const episode = el.querySelector('strong').textContent
            const magnetLink = el.parentNode.querySelector('.link-720p > .hs-magnet-link > a').href
            
            let json = { name, pageUrl, episode, magnetLink }
            json = { lastExecution: { extractedTarget: JSON.stringify(json) } }

            const key = JSON.stringify(json)
            if (localStorage.getItem(key)) return

            localStorage.setItem(key, true)
            sendUrlToReceive(json)
        })
    }, 5000)
}


const sendUrlToReceive = (body) => fetch(RECEIVE_SUBTITLES_URL, 
    { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
    .then(console.log)
    .catch(console.error)


function groupBy(xs, f) {
    return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}

const languages = {
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ma': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
}

getSubtitlesFromAPI().then(() => console.info('Subtitles loaded...'))
receiveNewUrls().then(() => console.info('Possibles subtitles sended...'))