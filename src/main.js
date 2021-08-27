import express from 'express';
import exressWs from 'express-ws';
import Room from './room.js';

const app = express();

exressWs(app);

const rooms = new Map();

app.ws('/battle', (ws, req) => {
    console.log(`[APP] battle ${req.query.room} ${req.query.user}`);
    if (!req.query.room || !req.query.user) {
        ws.close(1000, 'no room user');
    }

    let room;
    if (!rooms.has(req.query.room)) {
        console.log(`[APP] no room ${req.query.room}`);
        room = new Room();
        rooms.set(req.query.room, room);
    }
    
    room = rooms.get(req.query.room);
    room.connect(ws, req);    
    
});


app.listen(8088);
console.log('[APP] started');