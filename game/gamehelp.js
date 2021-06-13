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

        let loadSection = args && args[0] && Object.keys(helpData).indexOf(args[0]) !== -1;
        if(loadSection) {
            helpData = {
                key: helpData[args[0]]
            }
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const newEmbed = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.emoji + " " + props.title)
        .setURL(props.url);

        let fields = []
        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            fields = []
            let value = sectionAttrs?.help ? sectionAttrs.help : " "
            if(!loadSection) {
                values = []
                for(let command in sectionAttrs.commands) {
                    values.push("`" + command + "`")
                }
                value = values.join(", ")
            }
            fields.push(
                {
                    name: "**" + sectionAttrs.section + "**" + (section != "key" ? " (`" + section + "`)" : ""),
                    value: value
                }
            )
            if(loadSection) {
                let shown = false
                for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                    let show = true
                    if(args && args[1] && args[1] !== command) {
                        show = false
                    }
                    if(show) {
                        shown = true
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
                }
                if(!shown && (args && args[1])) {
                    fields.push(
                        {
                            name: "Error",
                            value: "Command `" + args[1] + "` not present in `" + sectionAttrs.section + "`."
                        }
                    )
                }
            }
            newEmbed.addFields(fields)
        }
        newEmbed.setThumbnail(defaults.thumbnail)
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
