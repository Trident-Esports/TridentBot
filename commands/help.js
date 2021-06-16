const fs = require('fs');
const pagination = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: "This is a help embed",
    execute(message, args) {
        let stripe = defaults["stripe"]

        let props = {
            "title": "***Help***",
            "url": "https://discord.com/KKYdRbZcPT",
            "description": "This is a list of the commands and help for VillainsBot.\n If you would like a list of commands for the MiniGame please type \`.gamehelp\`"
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

        const page1 = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.title)
        .setURL(props.url)
        .setDescription(props.description);

        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            page1.addField("**" + sectionAttrs.section + "**", sectionAttrs.help)
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                let value = commandAttrs.help.join("\n")
                if("aliases" in commandAttrs) {
                    value += "\n"
                    value += "[Aliases: " + commandAttrs.aliases.join(", ") + "]"
                }
                page1.addField("`" + defaults.prefix + command + "`", value)
            }
        }
        page1.setThumbnail(defaults.thumbnail)
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

        const page2 = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.title)
        .setURL(props.url)
        .setDescription(props.description);

        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            page2.addField("**" + sectionAttrs.section + "**", sectionAttrs.help)
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                let value = commandAttrs.help.join("\n")
                if("aliases" in commandAttrs) {
                    value += "\n"
                    value += "[Aliases: " + commandAttrs.aliases.join(", ") + "]"
                }
                page2.addField("`" + defaults.prefix + command + "`", value)
            }
        }
        page2.setThumbnail(defaults.thumbnail)
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

        const page3 = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.title)
        .setURL(props.url)
        .setDescription(props.description);

        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            page3.addField("**" + sectionAttrs.section + "**", sectionAttrs.help)
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                let value = commandAttrs.help.join("\n")
                if("aliases" in commandAttrs) {
                    value += "\n"
                    value += "[Aliases: " + commandAttrs.aliases.join(", ") + "]"
                }
                page3.addField("`" + defaults.prefix + command + "`", value)
            }
        }
        page3.setThumbnail(defaults.thumbnail)
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

        const pages = [
            page1,
            page2,
            page3
        ]
    
        const emoji = ["◀️", "▶️"]
    
        const timeout = '120000'
    
        pagination(message, pages, emoji, timeout)

    }
}
