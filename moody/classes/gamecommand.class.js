const { BaseCommand } = require('a-djs-handler');
const Levels = require('discord-xp');
const profileModel = require('../../models/profileSchema');
const healthModel = require('../../models/healthSchema');
const XPBoostModel = require('../../models/xpboostSchema');
const inventoryModel = require('../../models/inventorySchema');

module.exports = class GameCommand extends BaseCommand {
    constructor(comprops = {}) {
        super(comprops)
        this.Levels = Levels
        this.profileModel = profileModel
        this.healthModel = healthModel
        this.XPBoostModel = XPBoostModel
        this.inventoryModel = inventoryModel
    }
}
