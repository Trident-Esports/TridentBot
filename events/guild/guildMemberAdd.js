const profileModel = require('../../models/profileSchema');

const inventoryModel = require('../../models/inventorySchema')

module.exports = async (client, Discord, member) => {
    let profile = await profileModel.create({
        userID: member.id,
        serverID: member.guild.id,
        gold: 1000,
        bank: 0,
        minions: 1
    });
    profile.save();

    let inventory = await inventoryModel.create({
        userID: member.id,
        items: String
    });
    inventory.save();
}