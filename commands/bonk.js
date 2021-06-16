const fs = require('fs')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'bonk',
    /**
     * @param {Message} message
     */
    async execute(message, args, cmd, client) {
        let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
        let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
        let DEV = GLOBALS.DEV;

        let bonkIcon = "🔨"

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user)
            return message.channel.send('User not found.')

        BonkEmbed = new MessageEmbed()
            .setDescription(`${message.author} just bonked ${user}` + bonkIcon)
            .setColor('RANDOM')

        if(DEV) {
            let profile = { stripe:"default" }
            let stripe = profile["stripe"]

            switch (stripe) {
                default:
                    stripe = "#B2EE17";
                    break;
            }

            // Hack in my stuff to differentiate
            if (GLOBALS.DEV) {
                stripe = GLOBALS["stripe"]
                defaults.footer = GLOBALS.footer
            }

            profile["stripe"] = stripe

            BonkEmbed.setColor(stripe)
                .setFooter(defaults.footer.msg, defaults.footer.image)
        }

        message.channel.send(BonkEmbed);

    }
}
