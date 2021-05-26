const profileModel = require("../models/profileSchema");

const MessageEmbed = require('discord.js');

module.exports = {
  name: "withdraw",
  aliases: ['wd', 'with'],
  permissions: [],
  description: "withdraw coins from your bank",
  async execute(message, args, cmd, client, Discord, profileData) {
    var amount = args[0].toLowerCase()

    if (amount == 'all') amount = profileData.bank;
    if (amount == 'half') amount = profileData.bank / 2;

    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Withdrawn amount must be a whole number");

    try {
      if (amount > profileData.bank) return message.channel.send(`You don't have that amount of coins to withdraw`);

      await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            gold: amount,
            bank: -amount,
          },
        }
      );

      const newEmbed = new Discord.MessageEmbed()
        .setColor('#23dd17')
        .setTitle('**Deposit**')
        .setDescription(`**${message.author} Withdrew ${amount.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold into their Wallet!**\n _Check your balance using .Balance_`)
        .setThumbnail(message.author.avatarURL({ dynamic: true, format: 'png', size: 256 }))
        .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
        .setTimestamp();

      return message.channel.send(newEmbed);

    } catch (err) {
      console.log(err);
    }
  },
};