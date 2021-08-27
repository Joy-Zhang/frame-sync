import EventEmitter from "eventemitter3";

const DELAY = 3000;

export default class Pinger extends EventEmitter {


    stop() {
        clearTimeout(this.pingHandle);
    }

    constructor(ws) {
        super();
        console.log('[PING] create');
        this.ping = () => {
            console.log('[PING] ping');
            this.ws.ping();
            this.timeoutHandle = setTimeout(this.timeout, DELAY);
            this.pingTime = new Date().getTime();
        };
        
        this.timeout = () => {
            this.emit('timeout');
        };
        
        this.ws = ws;
        this.ws.on('pong', () => {
            console.log('[PING] pong');
            const elapsed = (new Date().getTime()) - this.pingTime;
            clearTimeout(this.timeoutHandle);
            this.pingHandle = setTimeout(this.ping, DELAY - elapsed);
        });
        this.ping();
    }
}