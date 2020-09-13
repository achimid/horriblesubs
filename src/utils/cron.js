const cron = require('node-cron');

const schedule = (callback, time) => new Promise((resolve, reject) => {
    cron.schedule(time || '*/3 * * * *' , () => {
        console.info('Iniciando execução do Job')
        try {
            resolve(callback())
        } catch (error) {
            console.error('Erro ao executar o Job', error)
            reject(error)
        }
        console.info('Finalizando execução do Job')
    })    
})

module.exports = schedule