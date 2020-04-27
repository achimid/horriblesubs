const PQ = require('./api/utils/promise-queue')

PQ.push(async () => setTimeout(() => console.log('N 1'), 1000))
PQ.push(async () => console.log('N 2'))
PQ.push(async () => console.log('N 3'))
PQ.push(async () => setTimeout(() => console.log('N 4'), 500))

const main = async () => {
    await PQ.execNext()
    await PQ.execNext()
    await PQ.execNext()
    await PQ.execNext()
}

main().then(() => console.log('finalizou'))