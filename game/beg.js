const profileModel = require("../models/profileSchema");
const Levels = require('discord-xp');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "beg",
  aliases: [],
  permissions: [],
  cooldown: 60,
  description: "Begs for Coins",
  async execute(message) {

    const randomNumber = Math.floor(Math.random() * 50) + 1;
    const randomXP = Math.floor(Math.random() * 50) + 15;

    await profileModel.findOneAndUpdate({
      userID: message.author.id,
    }, {
      $inc: {
        gold: randomNumber,
      },
    });

    let props = {
      "embedColor": "#B2EE17",
      "title": "***Beg***",
      "url": "https://discord.com/KKYdRbZcPT"
    }
    let footer = {
      "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
      "msg": "This bot was Created by Noongar1800#1800"
    }
    const newEmbed = new MessageEmbed()
      .setColor(props["embedColor"])
      .setTitle(props["title"])
      .setURL(props["url"])
      .addField(`${message.author.username} received ${randomNumber} **Gold**`, `Earned ${randomXP} XP`, true)
      .setThumbnail(message.author.displayAvatarURL({
        dynamic: true,
        format: 'png'
      }))
      .setFooter(footer["msg"], footer["image"])
      .setTimestamp();
    
    const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

    if (hasLeveledUP) {

      const user = await Levels.fetch(message.author.id);
      const target = message.author
      await profileModel.findOneAndUpdate({
        userID: target.id,
      }, {
        $inc: {
          gold: 1000,
          minions: 1
        },
      });

      let gainedmoney = 1000 // find a way to multiply these by amount of levels gained maybe through user.level differentiation.
      let gainedminions = 1

      newEmbed.setFooter(`${target.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+${gainedmoney} , 🐵+${gainedminions}`)
    }
    return message.channel.send(newEmbed);
  }
};