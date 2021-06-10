const fs = require('fs');
const profileModel = require('../../models/profileSchema')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'balance',
    aliases: ['bal'],
    permissions: [],
    description: "Checks the Users Balance",
    async execute(message, args, cmd, client, Discord){

        let mentionedMember = message.mentions.members.first() || message.guild.members.cache.get (args[0]);
        if (!mentionedMember) mentionedMember = message.member;

        if (!mentionedMember) return message.channel.send("That user does not exist");

        const profileData = await profileModel.findOne({ userID: mentionedMember.id });

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

        const newEmbed = new Discord.MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
            .setDescription(`This is ${mentionedMember}'s Balance`)
            .addField(` 💰 ${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Gold', true)
            .addField(` 🏦 ${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Bank', true)
            .addField(` 🐵 ${profileData.minions}`, 'Minions', true)
            .setThumbnail(mentionedMember.user.avatarURL({ dynamic: true, format: 'png'}))
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();

        message.channel.send(newEmbed);
    }
};
