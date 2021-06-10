const {
    MessageEmbed
} = require('discord.js')
const fs = require('fs')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'gamehelp',
    aliases: ['gh'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
        let props = {
            "stripe": "#B217EE", // Purple; Default is B2EE17 (Green)
            "title": "***Game Help***",
            "emoji": "<:V1LLA1N:848458548082114570>",
            "url": "https://discord.com/KKYdRbZcPT"
        }

        // Hack in my stuff to differentiate
        if (DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }

        props["stripe"] = stripe

        let helpData = JSON.parse(fs.readFileSync("game/dbs/help.json", "utf8"))

        if(args && args[0] && Object.keys(helpData).indexOf(args[0]) !== -1) {
            let key = args[0]
            helpData = {
                key: helpData[args[0]]
            }
        }

        const newEmbed = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.emoji + " " + props.title)
        .setURL(props.url);

        let fields = []
        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            fields = []
            fields.push(
                {
                    name: "**" + sectionAttrs.section + "**",
                    value: sectionAttrs?.help ? sectionAttrs.help : " "
                }
            )
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                let value = commandAttrs.help.join("\n")
                if("aliases" in commandAttrs) {
                    value += "\n"
                    value += "[Aliases: " + commandAttrs.aliases.join(", ") + "]"
                }
                fields.push(
                    {
                        name: "`" + defaults.prefix + command + "`",
                        value: value
                    }
                )
            }
            newEmbed.addFields(fields)
        }
        newEmbed.setThumbnail(props["thumbnail"])
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

        // Access info for each command name and the aliases
        if(!DEV) {
            message.channel.send("I have sent some Minions to your dm's.");
            message.channel.send("https://tenor.com/view/minions-despicable-me-cheer-happy-yay-gif-3850878")
        }
        message.delete
        if(DEV) {
            message.channel.send(newEmbed);
        } else {
            message.author.send(newEmbed);
        }
    }
}
