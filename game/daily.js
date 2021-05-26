const profileModel = require("../models/profileSchema");

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "daily",
  aliases: ['claim daily'],
  permissions: [],
  cooldown: 60 * 60 * 24,
  description: "Used as a Daily amount of Gold",
  async execute(message, args, cmd, client, discord) {

    const randomNumber = Math.floor(Math.random() * 0) + 30000;

    await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      },
      {
        $inc: {
          gold: randomNumber,
        },
      }
    );

    const DailyEmbed = new MessageEmbed()
      .setColor("#ffff00")
      .setTitle('**Daily**')
      .setDescription(`${message.author} has checked into the Lair for the Day.\n\nCollected ${randomNumber.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold`)
      .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
      .setTimestamp()

    console.log(this.cooldown);
    return message.channel.send(DailyEmbed);

  }
};