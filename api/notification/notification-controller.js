const router = require('express').Router()
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const email = process.env.EMAIL;

webpush.setVapidDetails(email, publicVapidKey, privateVapidKey);

const subscriptions = []

router.post('/subscribe', (req, res) => {
    const subscription = req.body
    subscriptions.push(subscription)

    res.status(201).send()
})

router.get('/', (req, res) => {
    sendNotificationAll()
    res.status(200).send()
})

const sendNotificationAll = () => { subscriptions.map(sendNotification) }

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
