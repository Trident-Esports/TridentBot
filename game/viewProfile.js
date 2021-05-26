const profileModel = require('../models/profileSchema');
const Levels = require('discord-xp')

module.exports = {
    name: 'viewProfile',
    aliases: ['vpr', 'vacc'],
    permissions: ["ADMINISTRATOR"],
    description: "Checks the Users Profile",
    async execute(message, args, cmd, client, Discord){
        
        if (!args.length) return message.channel.send("You need to mention a player to view their balance.");

        let mentionedMember = message.mentions.members.first();
        if (!mentionedMember) return message.channel.send("That user does not exist");
        
        const target = await Levels.fetch(mentionedMember.id, message.guild.id);
        const profileData = await profileModel.findOne({ userID: mentionedMember.id });

        const newEmbed = new Discord.MessageEmbed()
            .setColor('#23dd17')
            .setTitle('***Balance***')
            .setURL('https://discord.gg/KKYdRbZcPT')
            .setDescription(`This is ${mentionedMember}'s Profile\n\n ${profileData.Title}`)
            .addField(` ${target.level}`, 'Level', true)
            .addField(` ${target.xp}/${Levels.xpFor(target.level + 1)}`, 'XP', true)
            .addField(` 💚 ${profileData.health}%`, 'Life', true)
            .addField(` 💰 ${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Gold', true)
            .addField(` 🏦 ${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Bank', true)
            .addField(` 🐵 ${profileData.minions}`, 'Minions', true)
            .setThumbnail(mentionedMember.user.displayAvatarURL({ dynamic: true, format: 'png'}))
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();

        message.channel.send(newEmbed);
    }
};