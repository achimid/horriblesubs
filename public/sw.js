const SERVER_URL = 'https://horriblesubs-community.herokuapp.com'
// const SERVER_URL = 'http://localhost:9002'
const SUGGESTION_URL = SERVER_URL + '/api/v1/suggestion'

console.log('Loaded service worker!')

self.addEventListener('push', ev => {
    const data = ev.data.json()    
    self.registration.showNotification(data.title || "HorribleSubs Community", data)
})

self.addEventListener('notificationclick', function(event) {  
    const suggestionId = event.notification.data
  
    event.notification.close()
  
    if (event.action === 'ok') {        
      fetch(SUGGESTION_URL + '/upvote/' + suggestionId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})
    } else if (event.action === 'nok') {  
      fetch(SUGGESTION_URL + '/downvote/' + suggestionId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})
    } else {  
      console.log('nothing clicked') 
    }  
}, false)