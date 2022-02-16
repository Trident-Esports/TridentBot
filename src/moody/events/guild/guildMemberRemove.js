//@ts-check

const GuildMemberMoveEvent = require('../../classes/event/guildMemberMove.class')

// Member Join
module.exports = class GuildMemberRemoveEvent extends GuildMemberMoveEvent {
    constructor() {
        super('guildMemberRemove')
    }
}
