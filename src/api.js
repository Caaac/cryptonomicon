const tikerHandlers = new Map();

const API_KEY = '0ac651a9cdd49678de63491fb22c9c00e2af628b88d90bf4edaf4f602eb055fa'
const AGGREGATE_INDEX = '5'

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

socket.addEventListener('message', (ev) => {
    const {TYPE: type, FROMSYMBOL: tiker, PRICE: price, FLAGS: flags} = JSON.parse(ev.data);

    if (type !== AGGREGATE_INDEX || flags === 4){
        return;
    }

    const handlers = tikerHandlers.get(tiker) || [];
    handlers.forEach(fn => fn(price))
})

function sendMassageToWS(msg) {
    const stringifiedMessage = JSON.stringify(msg);

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage)
    }

    socket.addEventListener('open', () => {
        socket.send(stringifiedMessage)
    }, {once: true})
}

function subscribeTikerToWS(tiker) {
    const msg = {
        action: "SubAdd",
        subs: [`5~CCCAGG~${tiker}~USD`]
    };
    sendMassageToWS(msg)
}

function unsubscribeTikerFromWS(tiker) {
    const msg = {
        action: "SubRemove",
        subs: [`5~CCCAGG~${tiker}~USD`]
    };
    sendMassageToWS(msg)
}

export const subscribeToTiker = (tiker, cb) => {
    const subscribers = tikerHandlers.get(tiker) || [];
    tikerHandlers.set(tiker, [...subscribers, cb])

    subscribeTikerToWS(tiker)
}

export const unsubscribeFromTiker = (tiker) => {
    tikerHandlers.delete(tiker)

    unsubscribeTikerFromWS(tiker)
}