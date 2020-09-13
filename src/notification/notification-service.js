const webpush = require('web-push')
const SubscriptionModel = require('./subscription-model')

webpush.setVapidDetails(process.env.EMAIL, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)


const create = (subscription) => SubscriptionModel.create(subscription)

const newSubtitleNotification = (subtitle) => (subscription) => {
    const payload = {
        title: "New subtitle available!",
        body: subtitle.fileName,
        icon: 'https://horriblesubs-community.herokuapp.com/icon/android-chrome-192x192.png',
        // data: '5ea9bcdbeaf855229cd0ac2f',
        // actions: [  
        //     {action: 'ok', title: '👍 OK'},
        //     {action: 'nok', title: '👎 Not OK'}
        // ]  
    }
  
    webpush.sendNotification(subscription, JSON.stringify(payload))
        .catch(error => { console.info("Não foi possivel efetuar notificação") })
}

// const newSuggestionNotification = (subtitle) => (subscription) => {
//     const payload = {
//         title: "Help up evaluating!",
//         body: "Hi! -> Olá!",
//         icon: 'https://horriblesubs-community.herokuapp.com/icon/android-chrome-192x192.png',
//         data: '5ea9bcdbeaf855229cd0ac2f',
//         actions: [  
//             {action: 'ok', title: '👍 OK'},
//             {action: 'nok', title: '👎 Not OK'}
//         ]  
//     }
  
//     webpush.sendNotification(subscription, JSON.stringify(payload)).catch(error => { console.error(error.stack) })
// }

const sendNotificationNewSubtitle = async (subtitle) => {
    console.info('Enviando notificação de novo anime disponivel', subtitle.fileName)
    
    const subscriptions = await SubscriptionModel.findAllLean()
    subscriptions.map(newSubtitleNotification(subtitle))
}



module.exports = {
    create,
    sendNotificationNewSubtitle
}