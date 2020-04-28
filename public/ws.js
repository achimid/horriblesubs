console.log('Loaded service worker!')

self.addEventListener('push', ev => {
    const data = ev.data.json()    
    self.registration.showNotification(data.title || "HorribleSubs Community", data)
})

self.addEventListener('notificationclick', function(event) {  
    // var messageId = event.notification.data
  
    event.notification.close()
  
    if (event.action === 'ok') {  
      console.log('ok cliked') 
    } else if (event.action === 'nok') {  
      console.log('nok cliked') 
    } else {  
      console.log('nothin else clicked') 
    }  
}, false)