const fs = require('fs');
const { MessageEmbed } = require('discord.js')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
        let stripe = defaults["stripe"]

        let props = {
            "title": "***Help***",
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

        let helpData = JSON.parse(fs.readFileSync("commands/dbs/help.json", "utf8"))

        if(args && args[0] && Object.keys(helpData).indexOf(args[0]) !== -1) {
            let key = args[0]
            helpData = {
                key: helpData[args[0]]
            }
        }

        const newEmbed = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.title)
        .setURL(props.url)
        .setDescription('This is a list of the commands and help for VillainsBot.\nIf you would like a list of commands for the MiniGame please type _.gamehelp_');

        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            newEmbed.addField("**" + sectionAttrs.section + "**", sectionAttrs.help)
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                let value = commandAttrs.help.join("\n")
                if("aliases" in commandAttrs) {
                    value += "\n"
                    value += "[Aliases: " + commandAttrs.aliases.join(", ") + "]"
                }
                newEmbed.addField("`" + defaults.prefix + command + "`", value)
            }
        }
        newEmbed.setThumbnail(defaults.thumbnail)
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

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
