const SubscriptionModel = require('./subscription-model')

const create = (subscription) => new SubscriptionModel(subscription).save()

const listAll = () => SubscriptionModel.find().lean()

module.exports = {
    create,
    listAll
}