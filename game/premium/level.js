const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'level',
    aliases: ['lvl'],
    description: "This is a command to check your level progress",
    async execute(message, args, cmd, client) {
        let mentionedMember = message.mentions.members.first() || message.guild.members.cache.get (args[0]);
        if (!mentionedMember) mentionedMember = message.member;

        const target = await Levels.fetch(mentionedMember.user.id);
        if (!target) return message.channel.send("This member doesn't have a Level.😢");

        const LevelEmbed = new MessageEmbed()
        .setColor('#23dd17')
        .setTitle(`***LEVEL***`)
        .setURL('https://discord.gg/KKYdRbZcPT')
        .setDescription(`This is ${mentionedMember}'s Level`)
        .addField(` ${target.level}`, 'Level', true)
        .addField(` ${target.xp}/${Levels.xpFor(target.level + 1)}`, 'XP', true)
        .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
        .setTimestamp();

        message.channel.send(LevelEmbed);
    },
}