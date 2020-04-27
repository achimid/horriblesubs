const promList = []
let executing = null

const push = (p) => {
    promList.push(p)

    if (executing == null) execNext()
}

const execNext = async () => {
    if (!promList.length) return Promise.resolve()

    if (promList.length > 0) {        
        executing = promList.shift()
        const resp = await executing()
        executing = null        
        return Promise.resolve(resp)
    }
}

setInterval(() => promList.length > 0 ? console.log('Itens enfileirados: ', promList.length) : null, 10000)

module.exports = {
    push,
    execNext
}