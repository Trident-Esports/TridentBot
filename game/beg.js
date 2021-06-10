const fs = require('fs');
const profileModel = require("../models/profileSchema");
const Levels = require('discord-xp');
const { MessageEmbed } = require("discord.js");

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

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

    let stripe = defaults["stripe"]

    let props = {
      "title": "***Beg***",
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
      .addField(`${message.author.username} received ${randomNumber} **Gold**`, `Earned ${randomXP} XP`, true)
      .setThumbnail(message.author.displayAvatarURL({
        dynamic: true,
        format: 'png'
      }))
      .setFooter(defaults.footer.msg, defaults.footer.image)
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

      let level_gain = (user.level - (user.level + 1)); //find a way for this to find level difference before and after not just after for 1 level

      let gainedmoney = level_gain *1000
      let gainedminions = level_gain *100

      let msg = `${target.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+${gainedmoney} , 🐵+${gainedminions}`;
      if(DEV) {
          newEmbed.setDescription(msg);
      } else {
          newEmbed.setFooter(msg);
      }
    }
    return message.channel.send(newEmbed);
  }
};
