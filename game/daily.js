const profileModel = require("../models/profileSchema");
const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "daily",
  aliases: ['claim daily'],
  permissions: [],
  cooldown: 60 * 60 * 24,
  description: "Used as a Daily amount of Gold",
  async execute(message) {

    const randomNumber = Math.floor(Math.random() * 0) + 30000;

    await profileModel.findOneAndUpdate({
      userID: message.author.id,
    }, {
      $inc: {
        gold: randomNumber,
      },
    });

    let props = {
      "embedColor": "#FFFF00",
      "title": "**Daily**"
    }
    let footer = {
      "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
      "msg": "This bot was Created by Noongar1800#1800"
    }

    const DailyEmbed = new MessageEmbed()
      .setColor(props["embedColor"])
      .setTitle(props["title"])
      .setDescription(`${message.author} has checked into the Lair for the Day.\n\nCollected ${randomNumber.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold`)
      .setFooter(footer["msg"], footer["image"])
      .setTimestamp()

    return message.channel.send(DailyEmbed);

  }
};