import MainLoop from "./loop.js";
import {
    TYPE_S2C_FRAME_LIST,
    TYPE_C2S_FRAME_LIST,
    TYPE_C2S_CMD,
    TYPE_S2C_FRAME
} from './frame.js';

const USER_SYSTEM = 0;

export default class Room {

    constructor() {
        console.log('[ROOM] create');
        this.frames = [];
        this.loop = new MainLoop(this.frames);
        this.users = {};

        this.loop.on('frame', (frame) => {
            this.broadcast({
                type: TYPE_S2C_FRAME,
                frame
            });
        });
    }

    connect(ws, req) {
        console.log('[ROOM] connect');
        const user = req.query.user;
        this.users[user] = {
            ws
        };
        this.loop.pushFrame({type: 2, user});
        ws.on('close', () => {
            this.loop.pushFrame({type: 3, user});
        });
        ws.on('message', (messageContent) => {
            const message = JSON.parse(messageContent);
            switch (message.type) {
                case TYPE_C2S_CMD:
                    this.loop.pushFrame(message.frame, message.u);
                    break;
                case TYPE_C2S_FRAME_LIST:
                    const id = message.id;
                    const gap = this.frames.filter(frame => frame.id >= id);
                    ws.send(JSON.stringify({
                        type: TYPE_S2C_FRAME_LIST,
                        frames: gap
                    }));
                    break;
            }

        });
    }

    broadcast(frame) {
        for (let user in this.users) {
            this.users[user].ws.send(JSON.stringify(frame));
        }
    }
}