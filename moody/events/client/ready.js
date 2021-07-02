const { BaseEvent } = require('a-djs-handler')

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready')
    }

    async run(handler) {
        console.log(`${handler.client.user.username} is ready!`)
    }
}
