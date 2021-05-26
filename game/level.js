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

        let props = {
            "embedColor": "#B2EE17",
            "title": "***LEVEL***",
            "url": "https://discord.com/KKYdRbZcPT"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const LevelEmbed = new MessageEmbed()
        .setColor(props["embedColor"])
        .setTitle(props["title"])
        .setURL(props["url"])
        .setDescription(`This is ${mentionedMember}'s Level`)
        .addField(` ${target.level}`, 'Level', true)
        .addField(` ${target.xp}/${Levels.xpFor(target.level + 1)}`, 'XP', true)
        .setFooter(footer["msg"], footer["image"])
        .setTimestamp();

        message.channel.send(LevelEmbed);
    },
}
