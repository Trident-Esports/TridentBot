const { MessageEmbed } = require("discord.js");

const cooldownsModel = require('../../models/cooldownsSchema')

module.exports = {
    name: 'cooldown',
    aliases: ['cd'],
    permissions: [],
    description: "Checks the user's cooldowns",
    async execute(message, client, Discord) {

        const cooldownEmbed = new MessageEmbed()
            .setColor('#23dd17')
            .setTitle('***Cooldowns***')
            .setURL('https://discord.gg/KKYdRbZcPT')
            .setDescription(`This is ${message.author}'s cooldowns`)
            .setThumbnail(message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();
        
            
        var daily_cooldown = await cooldownsModel.findOne({ userID: message.author.id});
        var cooldowns = (daily_cooldown["usedcooldowns"])
        console.log(cooldowns);

        // if (daily_cooldown === 0) {
        //     cooldownEmbed.addField('🕐', '**DAILY**', true)
        // } else {
        //     cooldownEmbed.addField('✅', '**DAILY**', true)
        // }

        // var beg_cooldown = await cooldownsModel.find({ userID: message.author.id, usedcooldowns: 'beg' });
        // console.log(beg_cooldown)

        // if (beg_cooldown === 0) {
        //     cooldownEmbed.addField('🕐', '**BEG**', true)
        // } else {
        //     cooldownEmbed.addField('✅', '**BEG**', true)
        // }

        // var search_cooldown = await cooldownsModel.find({ userID: message.author.id, usedcooldowns: 'search' });
        // console.log(search_cooldown)

        // if (search_cooldown === 0) {
        //     cooldownEmbed.addField('🕐', '**SEARCH**', true)
        // } else {
        //     cooldownEmbed.addField('✅', '**SEARCH**', true)
        // }

        // var fight_cooldown = await cooldownsModel.find({ userID: message.author.id, usedcooldowns: 'fight' });
        // console.log(fight_cooldown)

        // if (fight_cooldown === 0) {
        //     cooldownEmbed.addField('🕐', '**FIGHT**', true)
        // } else {
        //     cooldownEmbed.addField('✅', '**FIGHT**', true)
        // }

        // var rob_cooldown = await cooldownsModel.find({ userID: message.author.id, usedcooldowns: 'rob' });
        // console.log(rob_cooldown)

        // if (rob_cooldown === 0) {
        //     cooldownEmbed.addField('🕐', '**ROB**', true)
        // } else {
        //     cooldownEmbed.addField('✅', '**ROB**', true)
        // }


        message.channel.send(cooldownEmbed);
    }

};