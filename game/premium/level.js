const fs = require('fs');
const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'level',
    aliases: ['lvl'],
    description: "This is a command to check your level progress",
    async execute(message, args, cmd, client) {
        let mentionedMember = message.mentions.members.first() || message.guild.members.cache.get (args[0]);
        if (!mentionedMember) mentionedMember = message.member;

        const target = await Levels.fetch(mentionedMember.user.id, message.guild.id);
        if (!target) return message.channel.send("This member doesn't have a Level.😢");

        let stripe = defaults["stripe"]

        let props = {
            "title": "***LEVEL***",
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

        const LevelEmbed = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.title)
        .setURL(props.url)
        .setDescription(`This is ${mentionedMember}'s Level`)
        .addField(` ${target.level}`, 'Level', true)
        .addField(` ${target.xp}/${Levels.xpFor(target.level + 1)}`, 'XP', true)
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

        message.channel.send(LevelEmbed);
    },
}
