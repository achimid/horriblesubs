const router = require('express').Router()
const webpush = require('web-push')
const service = require('./notification-service')

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const email = process.env.EMAIL;

webpush.setVapidDetails(email, publicVapidKey, privateVapidKey);

router.post('/subscribe', (req, res) => {
    service.create(req.body)
        .then((data) => res.status(201).json(data))
        .catch(() => res.status(409).send())    
})

router.get('/', (req, res) => {
    sendNotificationAll()
    res.status(200).send()
})

const sendNotificationAll = () => service.listAll().then(subscriptions => (subscriptions || []).map(sendNotification))

const sendNotification = (subscription) => {
    const payload = {
        title: "titleafsadf",
        body: "data.body",
        icon: 'https://horriblesubs-community.herokuapp.com/icon/android-chrome-192x192.png',
        actions: [  
            {action: 'ok', title: '👍 OK'},
            {action: 'nok', title: '👎 Not OK'}
        ]  
    }
  
    webpush.sendNotification(subscription, JSON.stringify(payload)).catch(error => { console.error(error.stack) })
}


module.exports = router
