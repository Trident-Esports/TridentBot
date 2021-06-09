const fs = require('fs');

const { Message, MessageEmbed } = require('discord.js')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'rules',
    description: "Rules to follow!",
    execute(message, args, cmd, client, Discord) {

        let props = {
            "title": "***Rules***",
            "url": "https://discord.com/KKYdRbZcPT"
        }

        let stripe = defaults["stripe"]
        switch (stripe) {
            default:
                stripe = "#E42643";
                break;
        }

        // Hack in my stuff to differentiate
        if (DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }

        props["stripe"] = stripe

        let rules = JSON.parse(fs.readFileSync("commands/dbs/rules.json", "utf8"))

        const newEmbed = new MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
            .setDescription('Any breaking of these rules will result in consequences');
        let fields = []
        for(let rule in rules) {
            fields.push(
                {
                    name: "**Rule " + (parseInt(rule) + 1) + "**",
                    value: "`" + rules[rule] + "`"
                }
            )
        }
        newEmbed.addFields(fields)
        .setThumbnail(defaults.thumbnail)
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

        message.channel.send(newEmbed);
    }
}
