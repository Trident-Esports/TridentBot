const profileModel = require('../../models/profileSchema');

const inventoryModel = require('../../models/inventorySchema')

module.exports = async (client, Discord, member) => {
    /*
    Create Minigamer profile
    FIXME: Errors if profile already exists
    Check to see if there's already one in the DB
    Bail if there is one
    */
    let profile = await profileModel.create({
        userID: member.id,
        serverID: member.guild.id,
        gold: 1000,
        bank: 0,
        minions: 1
    });
    profile.save();

    //FIXME: Make sure this loads schema from ./modelds/inventorySchema.js
    let inventory = await inventoryModel.create({
        userID: member.id,
        items: String
    });
    inventory.save();
}
