const { BaseCommand } = require('a-djs-handler');
const Levels = require('discord-xp');
const profileModel = require('../../models/profileSchema');

module.exports = class GameCommand extends BaseCommand {
    constructor(comprops = {}) {
        super(comprops)
        this.Levels = Levels
        this.profileModel = profileModel
    }
}
