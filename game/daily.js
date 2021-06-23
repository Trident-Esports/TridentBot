const fs = require('fs');

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

    let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
    let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
    let DEV = GLOBALS.DEV;

    let stripe = defaults["stripe"]

    const randomNumber = Math.floor(Math.random() * 0) + 30000;

    await profileModel.findOneAndUpdate({
      userID: message.author.id,
    }, {
      $inc: {
        gold: randomNumber,
      },
    });

    let props = {
      "title": "**Daily**"
    }
    switch (stripe) {
        default:
            stripe = "#FFFF00"; // Yellow
            break;
    }

    // Hack in my stuff to differentiate
    if (DEV) {
        stripe = GLOBALS["stripe"]
        defaults.footer = GLOBALS.footer
    }

    props["stripe"] = stripe

    const DailyEmbed = new MessageEmbed()
      .setColor(props.stripe)
      .setTitle(props.title)
      .setDescription(`${message.author} has checked into the Lair for the Day.\n\nCollected ${randomNumber.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold`)
      .setFooter(defaults.footer.msg, defaults.footer.image)
      .setTimestamp()

    return message.channel.send(DailyEmbed);

  }
};
