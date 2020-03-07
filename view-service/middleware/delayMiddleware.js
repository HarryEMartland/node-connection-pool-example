const fetch = require('node-fetch');
const Agent = require('agentkeepalive');
const client = require('prom-client');

const keepaliveAgent = new Agent({});

var gauge = new client.Gauge('connection_pool', 'connection pool stats', ['metric']);

setInterval(() => {
    if (keepaliveAgent.statusChanged) {
        const status = keepaliveAgent.getCurrentStatus();
        gauge.set({ metric: 'createSocketCount' }, status.createSocketCount);
        gauge.set({ metric: 'closeSocketCount' }, status.closeSocketCount);
        gauge.set({ metric: 'timeoutSocketCount' }, status.timeoutSocketCount);
        gauge.set({ metric: 'requestCount' }, status.requestCount);
        console.log(status)
    }
}, 2000);

module.exports = async (req, res, next) => {
    const options = {};
    if (req.query.keepalive) {
        options.agent = keepaliveAgent;
    }
    try {
        res.locals.delayData = await fetch("http://delay-service:3000/delay", options);
    } finally {
        next()
    }
}