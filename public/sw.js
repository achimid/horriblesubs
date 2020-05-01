const API = ''
// const API = 'https://horriblesubs-community.herokuapp.com'
// const API = 'http://localhost:9002'


self.addEventListener('push', ev => {
    const data = ev.data.json()    
    self.registration.showNotification(data.title || "HorribleSubs Community", data)
})

self.addEventListener('notificationclick', function(event) {  
    const suggestionId = event.notification.data
  
    event.notification.close()
  
    if (event.action === 'ok') {        
      fetch(`${API}/suggestion/upvote/${suggestionId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})
    } else if (event.action === 'nok') {  
      fetch(`${API}/suggestion/downvote/${suggestionId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})
    } else {  
      console.log('nothing clicked') 
    }  
}, false)