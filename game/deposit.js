const profileModel = require("../models/profileSchema");

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    permissions: [],
    description: "Deposit coins into your bank!",
    async execute(message, args, cmd, client, Discord, profileData) {
        var amount = args[0].toLowerCase()

        if (amount == 'all') amount = profileData.gold;
        if (amount == 'half') amount = profileData.gold/2;

        if (amount % 1 != 0 || amount <= 0) return message.channel.send('Deposit amount must be a whole number');
        try {
            if (amount > profileData.gold) return message.channel.send(`You only have 💰 ${profileData.gold}`)
            await profileModel.findOneAndUpdate({
                userID: message.author.id
            },
                {
                    $inc: {
                        gold: -amount,
                        bank: amount,
                    },

                }

            );
        } catch (err) {
            console.log(err);
        }
        {
            const newEmbed = new Discord.MessageEmbed()
            .setColor('#23dd17')
            .setTitle('**Deposit**')
            .setDescription(`**${message.author} has Deposited 💰 ${amount.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold into their Bank!**\n _Check your balance using .Balance_`)
            .setThumbnail(message.author.avatarURL({ dynamic: true, format: 'png', size: 256}))
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();
            
        return message.channel.send(newEmbed)
        }
    }
};