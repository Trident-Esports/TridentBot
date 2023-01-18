//@ts-check

const MessageReactionEvent = require('../../classes/event/messageReaction.class')

module.exports = class MessageReactionAddEvent extends MessageReactionEvent {
    constructor() {
        super('messageReactionAdd')
    }
}
