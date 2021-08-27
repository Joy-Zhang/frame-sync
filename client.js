(function (window) {

    class FrameEvent extends Event {
        constructor(frame) {
            super('frame');
            this.frame = frame;
        }
    }

    class FrameSync extends EventTarget {

        constructor(endpoint, room, user) {
            super();
            this.room = room;
            this.user = user;
            this.url = `${endpoint}?room=${room}&user${user}`;

            this.syncFrames = () => {
                this.ws.send(JSON.stringify({
                    type: 2,
                    id: this.frames.length
                }));
            };

            this.nextFrame = frame => {
                if (frame.id === this.frames.length) {
                    this.frames.push(frame);
                    this.dispatchEvent(new FrameEvent(frame));
                } else {
                    this.syncFrames();
                }
            }

            this.connect = () => {
                this.ws = new WebSocket(this.url);
                this.ws.binaryType = 'arraybuffer';
                this.frames = [];


                this.ws.onopen = event => {
                    this.syncFrames();
                };
                this.ws.onmessage = event => {
                    const message = JSON.parse(event.data);
                    switch (message.type) {
                        case 1:
                            message.frames.forEach(frame => {
                                this.nextFrame(frame);
                            });
                            break;
                        case 4:
                            this.nextFrame(frame);
                            break;
                    }

                };

                this.ws.onclose = event => {
                    this.connect();
                }

            }

            this.connect();

        }


        sendCommand(command) {
            this.ws.send(JSON.stringify({
                type: 3,
                u: user,
                cmd: command
            }));
        }
    }

    window.FrameSync = FrameSync;


})(window)

