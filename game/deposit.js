const fs = require('fs');

const {
    MessageEmbed
} = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    permissions: [],
    description: "Deposit coins into your bank!",
    async execute(message, args, profileData) {
        var amount = args[0].toLowerCase()

        if (amount == 'all') amount = profileData.gold;
        if (amount == 'half') amount = profileData.gold / 2;

        if (amount % 1 != 0 || amount <= 0) return message.channel.send('Deposit amount must be a whole number');
        try {
            if (amount > profileData.gold) return message.channel.send(`You only have 💰 ${profileData.gold}`)
            await profileModel.findOneAndUpdate({
                    userID: message.author.id
                }, {
                    $inc: {
                        gold: -amount,
                        bank: amount,
                    },

                }

            );
        } catch (err) {
            console.log(err);
        } {
            let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
            let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
            let DEV = GLOBALS.DEV;

            let stripe = defaults["stripe"]

            let props = {
                "title": "**Deposit**"
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

            const newEmbed = new MessageEmbed()
                .setColor(props.stripe)
                .setTitle(props.title)
                .setDescription(`**${message.author} has Deposited 💰 ${amount.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold into their Bank!**\n _Check your balance using .Balance_`)
                .setThumbnail(message.author.displayAvatarURL({
                    dynamic: true,
                    format: 'png'
                }))
                .setFooter(defaults.footer.msg, defaults.footer.image)
                .setTimestamp();

            return message.channel.send(newEmbed)
        }
    }
};
