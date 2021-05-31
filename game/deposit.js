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
            let props = {
                "embedColor": "#B2EE17",
                "title": "**Deposit**"
            }
            let footer = {
                "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
                "msg": "This bot was Created by Noongar1800#1800"
            }

            const newEmbed = new MessageEmbed()
                .setColor(props["embedColor"])
                .setTitle(props["title"])
                .setDescription(`**${message.author} has Deposited 💰 ${amount.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold into their Bank!**\n _Check your balance using .Balance_`)
                .setThumbnail(message.author.displayAvatarURL({
                    dynamic: true,
                    format: 'png'
                }))
                .setFooter(footer["msg"], footer["image"])
                .setTimestamp();

            return message.channel.send(newEmbed)
        }
    }
};
