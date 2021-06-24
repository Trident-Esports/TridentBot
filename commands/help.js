const fs = require('fs');
const pagination = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js');
const { search } = require('yt-search');

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

        let scope = "all"
        let search = {
            "term": null,
            "single": null
        }

        if(args) {
            if(args[0]) {
                search["term"] = args[0]
                if(args[1]) {
                    search["term"] = args[1]
                    search["single"] = args[1]
                }
            }
        }

        if(search.term) {
            if(Object.keys(helpData).indexOf(search.term) !== -1) {
                let key = search.term
                helpData = {
                    key: helpData[key]
                }
                scope = "section"
            } else {
                for(let [section, commands] of Object.entries(helpData)) {
                    if(Object.keys(commands.commands).indexOf(search.term) !== -1) {
                        let key = section
                        helpData = {
                            key: helpData[key]
                        }
                        scope = "single"
                    }
                }
            }
        }

        let pages = []

        for(let [section, sectionAttrs] of Object.entries(helpData)) {
            let thisPage = new MessageEmbed()
                .setColor(props.stripe)
                .setTitle(props.title)
                .setURL(props.url)
                .setDescription(props.description)
                .setThumbnail(defaults.thumbnail)
                .setFooter(defaults.footer.msg, defaults.footer.image)
                .setTimestamp();
            thisPage.addField("**" + sectionAttrs.section + "**", sectionAttrs.help)
            for(let [command, commandAttrs] of Object.entries(sectionAttrs.commands)) {
                if((["all", "section"].indexOf(scope) > -1) || (scope == "single" && command == search.term)) {
                    let value = commandAttrs.help.join("\n")
                    if("aliases" in commandAttrs) {
                        value += "\n"
                        value += "[Aliases: " + commandAttrs.aliases.join(", ") + "]"
                    }
                    thisPage.addField("`" + defaults.prefix + command + "`", value)
                }
            }
            pages.push(thisPage)
        }

        if(pages.length <= 1) {
            message.channel.send(pages[0])
        } else {
            const emoji = ["◀️", "▶️"]

            const timeout = '120000'

            pagination(message, pages, emoji, timeout)
        }
    }
}
