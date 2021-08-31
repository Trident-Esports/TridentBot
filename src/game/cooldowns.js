//FIXME: Convert to Class

const fs = require('fs');

const {
    MessageEmbed
} = require("discord.js");
const cooldownsModel = require('../models/cooldownsSchema');

module.exports = {
    name: 'cooldown',
    aliases: ['cd'],
    permissions: [],
    description: "Checks the user's cooldowns",
    async execute(message) {
        let GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json", "utf8"))
        const defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
        GLOBALS = (
            GLOBALS?.profile &&
            GLOBALS?.profiles &&
            GLOBALS.profile in GLOBALS.profiles
        ) ?
            GLOBALS.profiles[GLOBALS.profile]:
            defaults
        const DEV = GLOBALS?.DEV ? GLOBALS.DEV : false;

        let stripe = defaults["stripe"]

        let props = {
            "title": "***Cooldowns***",
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

        const cooldownEmbed = new MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
            .setDescription(`This is ${message.author}'s cooldowns`)
            .setThumbnail(message.author.avatarURL({
                dynamic: true,
                format: 'png'
            }))
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();


        var daily_cooldown = await cooldownsModel.findOne({
            userID: message.author.id
        });
        var cooldowns = (daily_cooldown["usedcooldowns"])
        console.log(cooldowns);

        for(let cdType of [
            "daily",
            "beg",
            "search",
            "fight",
            "rob"
        ]) {
            let cd = await cooldownsModel.find({
                userID: message.author.id,
                usedcooldowns: cdType
            })
            let icon = ((cd === 0) ? "🕐" : "✅")
            cooldownEmbed.addField(
                icon,
                "**" + cdType + "**",
                true
            )
            console.log(cd)
        }

        // message.channel.send({ embeds: [cooldownEmbed] }); // discord.js v13
        message.channel.send(cooldownEmbed);
    }

};