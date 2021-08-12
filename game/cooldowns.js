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
        let props = {
            "title": "***Cooldowns***",
            "url": "https://discord.com/KKYdRbZcPT"
        }

        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
        // Bail if we fail to get server profile information
        if (!GLOBALS) {
            // this.error = true
            // this.props.description = "Failed to get server profile information."
            return
        }

        let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
        // Bail if we fail to get default bot information
        if (!defaults) {
            // this.error = true
            // this.props.description = "Failed to get default bot information."
            return
        }
        let DEV = GLOBALS.DEV;

        let stripe = defaults["stripe"]

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

        message.channel.send(cooldownEmbed);
    }

};
