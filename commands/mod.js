const fs = require('fs');
const { Message, MessageEmbed } = require('discord.js')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'mod',
    description: 'Mod Commands!',
    execute(message, args) {
        let stripe = defaults["stripe"]

        APPROVED_ROLES = ROLES["admin"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) )
            return message.channel.send('You dont have the correct permissions');

        let props = {
            "embedColor": "#B2EE17",
            "title": "***Help***",
            "url": "https://discord.gg/KKYdRbZcPT"
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

        const newEmbed = new MessageEmbed()
        .setColor(props.stripe)
        .setTitle(props.title)
        .setURL(props.url)

        let mod_commands = JSON.parse(fs.readFileSync("commands/dbs/mod.json", "utf8"))

        if(args && args[0] && Object.keys(mod_commands).indexOf(args[0]) !== -1) {
            let key = args[0]
            let tmp = mod_commands[key]
            mod_commands = {}
            mod_commands[key] = tmp
        }

        newEmbed.addField(
            "MOD COMMANDS",
            "Commands for only Moderators to use"
        )
        for (let [command, commandAttrs] of Object.entries(mod_commands)) {
            let value = commandAttrs.help.join("\n")
            if("aliases" in commandAttrs) {
                value += "\n"
                value += "_[Aliases: " + commandAttrs.aliases.join(", ") + "]_"
            }
            newEmbed.addField(
                defaults.prefix + commandAttrs.syntax.replace("%%",command),
                value
            )
        }
        newEmbed.setThumbnail(defaults.thumbnail)
        .setFooter(defaults.footer.msg, defaults.footer.image)
        .setTimestamp();

        message.channel.send("I have sent a list of the mod commands to your dm's")
        message.delete
        // If DEV flag, send to channel
        if(DEV) {
            message.channel.send(newEmbed);
        } else {
            // If Live, send to user in DM
            message.author.send(newEmbed);
        }
    }
}
