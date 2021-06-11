const fs = require('fs');
const { Message, MessageEmbed } = require('discord.js')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'helpline',
    aliases: ['hl'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
        try {
            let stripe = defaults["stripe"]

            let props = {
                "title": "***HelpLine***",
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

            const newEmbed = new MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
            .setDescription('This is a list of the commands and help for VillainsBot')
            .addField(
                '**General Help**',
                'This is a ticket for general discord help.\n `Command = .ticket`'
            )
            .addField(
                '**Queens Babies**',
                "This is a ticket for help with anything womens related that maybe guys might not understand or something abit personal that our selected women's helpers can help with.\n `Command = .qbticket`"
            )
            .addField(
                '**The Boys**',
                'Here at Villains we understand that sometimes guys have problems too that they might not want to confront with alone. If you would like someone to talk to then feel free to create a ticket.\n `Command = .tbticket`'
            )
            .setThumbnail(defaults.thumbnail)
            .setImage('https://multiculturalmarriage.files.wordpress.com/2013/07/help-button-hi.png')
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();

            message.channel.send(newEmbed);
        }
        catch(err) {
            console.log(err)
        }
    }
}
