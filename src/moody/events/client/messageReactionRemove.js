//@ts-check

const MessageReactionEvent = require('../../classes/event/messageReaction.class')

module.exports = class MessageReactionRemoveEvent extends MessageReactionEvent {
    constructor() {
        super('messageReactionRemove')
    }
}
