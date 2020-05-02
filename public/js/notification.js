const publicVapidKey = 'BNysbKQRpbdbXU5XR390u28eCoGoKPDJkqRFP30xBWnqM5UodAu-03WE15B7O9GXVLxoH_7OLAAZGOmQqWbY6hI'

const run = async () => {
  console.log('Registering service worker')
  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
  console.log('Registered service worker')


  console.log('Registering push')
  const options = { userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicVapidKey) }
  const subscription = await registration.pushManager.subscribe(options)
  console.log('Registered push')


  console.log('Sending push')
  subscribeNotificationAPI(subscription)
  console.log('Sent push')
}


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function registerNotification() {
  if ('serviceWorker' in navigator) {
    console.log('Registering service worker')
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        run().catch(() => run().catch(error => console.error(error)))
      }
    })

  }
}


// navigator.serviceWorker.getRegistrations(location.href).then(registrations => { 
//   if (registrations.length == 0) registerNotification() 
// })