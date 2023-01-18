//@ts-check

const GuildMemberMoveEvent = require('../../classes/event/guildMemberMove.class')

// Member Join
module.exports = class GuildMemberAddEvent extends GuildMemberMoveEvent {
    constructor() {
        super('guildMemberAdd')
    }
}
