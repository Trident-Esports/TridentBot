const fs = require('fs');

const Levels = require('discord-xp');

const profileModel = require('../models/profileSchema');
const healthModel = require('../models/healthSchema');
const XPBoostModel = require('../models/xpboostSchema');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'profile',
    aliases: ['pr', 'acc'],
    permissions: [],
    description: "Checks the Users Profile",
    async execute(message, args) {

        let mentionedMember = null;
        if (args.length) {
            mentionedMember = message.mentions.members.first().user;
        } else {
            mentionedMember = message.author;
        }

        if (!mentionedMember) return message.channel.send("That user does not exist");

        const profileData = await profileModel.findOne({ userID: mentionedMember.id });
        const healthData = await healthModel.findOne({ userID: mentionedMember.id });
        const XPBoostData = await XPBoostModel.findOne({ userID: message.author.id });
        const target = await Levels.fetch(mentionedMember.id, message.guild.id);

        if (!profileData) return message.channel.send("That user does not have a profile");

        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
        let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
        let DEV = GLOBALS.DEV;

        let stripe = defaults["stripe"]

        let props = {
            "title": "***Balance***",
            "url": "https://discord.com/KKYdRbZcPT"
        }
        switch (stripe) {
            default:
                stripe = "#B2EE17";
                break;
        }

        // Hack in my stuff to differentiate
        if (DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }

        props["stripe"] = stripe

        var newEmbed = new MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
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
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();

        message.channel.send(newEmbed);
    }
};