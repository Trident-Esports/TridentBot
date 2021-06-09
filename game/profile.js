const Levels = require('discord-xp');

const profileModel = require('../models/profileSchema');
const healthModel = require('../models/healthSchema');
const XPBoostModel = require('../models/xpboostSchema');

module.exports = {
    name: 'profile',
    aliases: ['pr', 'acc'],
    permissions: [],
    description: "Checks the Users Profile",
    async execute(message, args, cmd, client, Discord) {

        if (args.length) {
            var mentionedMember = message.mentions.members.first();
        } else {
            var mentionedMember = message.author;
        }

        if (!mentionedMember) return message.channel.send("That user does not exist");

        const profileData = await profileModel.findOne({ userID: mentionedMember.id });
        const healthData = await healthModel.findOne({ userID: mentionedMember.id });
        const XPBoostData = await XPBoostModel.findOne({ userID: message.author.id });
        const target = await Levels.fetch(mentionedMember.id, message.guild.id);

        if (!profileData) return message.channel.send("That user does not have a profile");

        let props = {
            "embedColor": "#B2EE17",
            "title": "***Balance***",
            "url": "https://discord.com/KKYdRbZcPT"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        if (args.length) {
            var newEmbed = new Discord.MessageEmbed()
                .setColor(props["embedColor"])
                .setTitle(props["title"])
                .setURL(props["url"])
                .setDescription(`This is ${mentionedMember}'s Profile`)
                .addField('Title', `Beta Tester`, false)
                .addField(` ${target.level}`, 'Level', true)
                .addField(` ${target.xp.toLocaleString()} / ${Levels.xpFor(target.level + 1).toLocaleString()}`, 'XP', true)
                .addField(` 💚 ${healthData.health}%`, 'Life', true)
                .addField(` 💰 ${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Gold', true)
                .addField(` 🏦 ${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Bank', true)
                .addField(` 🐵 ${profileData.minions}`, 'Minions', true)
                .addField(` ${XPBoostData.xpboost}%`, 'XPBoost', true)
                .setThumbnail(mentionedMember.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setFooter(footer["msg"], footer["image"])
                .setTimestamp();
        } else {
            var newEmbed = new Discord.MessageEmbed()
                .setColor(props["embedColor"])
                .setTitle(props["title"])
                .setURL(props["url"])
                .setDescription(`This is ${mentionedMember}'s Profile`)
                .addField('Title', `Beta Tester`, false)
                .addField(` ${target.level}`, 'Level', true)
                .addField(` ${target.xp.toLocaleString()}/${Levels.xpFor(target.level + 1).toLocaleString()}`, 'XP', true)
                .addField(` 💚 ${healthData.health}%`, 'Life', true)
                .addField(` 💰 ${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Gold', true)
                .addField(` 🏦 ${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Bank', true)
                .addField(` 🐵 ${profileData.minions}`, 'Minions', true)
                .addField(` ${XPBoostData.xpboost}%`, 'XPBoost', true)
                .setThumbnail(mentionedMember.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setFooter(footer["msg"], footer["image"])
                .setTimestamp();
        }

        message.channel.send(newEmbed);
    }
};