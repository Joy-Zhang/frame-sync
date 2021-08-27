import EventEmitter from "eventemitter3";

const DELAY = 50;
const USER_SYSTEM = 0;

export default class MainLoop extends EventEmitter {

    tickFrame() {
        return {
            type: 1
        };
    }

    pushFrame(frame, user) {
        if (!user) {
            user = USER_SYSTEM;
        }

        frame.id = this.sequence++;
        frame.t = new Date().getTime();
        frame.u = user;
        this.frames.push(frame);
        // console.log(`[LOOP] push frame (${frame.id},${frame.type})`);
        this.emit('frame', frame);
    }

    constructor(frames) {
        super();
        console.log('[LOOP] create');
        this.frames = frames;
        this.sequence = 0;

        this.tick = () => {
            const frame = this.tickFrame();
            this.pushFrame(frame);
            setTimeout(this.tick, DELAY);
        };

        setTimeout(this.tick, DELAY);
    }
}