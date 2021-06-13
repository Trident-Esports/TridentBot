const profileModel = require("../models/profileSchema");
const healthModel = require('../models/healthSchema');
const Levels = require('discord-xp');
const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "search",
  aliases: [],
  permissions: [],
  cooldown: 60 * 5,
  category: "economy",
  description: "Choose your search location and have a chance at some gold!",

  async execute(message) {

    const randomXP = Math.floor(Math.random() * 200) + 50;
    const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

    const LOCATIONS = [
      "Forest",
      "Sewer",
      "Cave",
      "Mansion",
      "Dungeon",
      "Graveyard",
      "Abandoned Mine",
    ];

    let chosenLocations = LOCATIONS.sort(() => Math.random() - Math.random()).slice(0, 3);

    const RANDOM_NUMBER = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    const RANDOM_MINIONS = Math.floor(Math.random() * 10) + 1;
    var Health_Loss = Math.floor(Math.random() * 10) + 1;

    const FILTER = (m) => {
      return chosenLocations.some((answer) => answer.toLowerCase() === m.content.toLowerCase()) && m.author.id === message.author.id;
    };

    const COLLECTOR = message.channel.createMessageCollector(FILTER, {
      max: 1,
      time: 25000
    });

    COLLECTOR.on("collect", async (m) => {

      var number = Math.round(Math.random() * 100);

      var success = 80;
      var fail = 95;
      var special = 100;

      console.log(number);

      const SUCCESS_EMBED = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${message.author.username} searched the ${m.content} 🕵️`)
        .setDescription(`You searched the ${m.content} and found 💰${RANDOM_NUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold\n\nEarned ${randomXP} XP`)
        .setTimestamp();

      const FAIL_EMBED = new MessageEmbed()
        .setColor("RED")
        .setTitle(`${message.author.username} searched the ${m.content} 🕵️`)
        .setDescription(`You searched the ${m.content} and got injured! This causes you to drop ${RANDOM_NUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold.\n Maybe a bad idea or just Unlucky.\n\nEarned ${randomXP} XP and even more experience of not to do it again xD`)
        .setTimestamp();

      const SPECIAL_EMBED = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`${message.author.username} searched the ${m.content} 🕵️`)
        .setDescription(`You go to search the ${m.content} and for some reason find ${RANDOM_MINIONS} Minions following you home.\n\nEarned ${randomXP} XP`)
        .setTimestamp()

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
        SUCCESS_EMBED.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
        FAIL_EMBED.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
        SPECIAL_EMBED.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
      }

      let goldincrease = await profileModel.findOneAndUpdate({
        userID: message.author.id,
      }, {
        $inc: {
          gold: RANDOM_NUMBER,
        },
      });

      let goldremove = await profileModel.findOneAndUpdate({
        userID: message.author.id,
      }, {
        $inc: {
          gold: -RANDOM_NUMBER,
        },
      });

      let healthloss = await healthModel.findOneAndUpdate({
        userID: message.author.id,
      }, {
        $inc: {
          health: -Health_Loss,
        },
      });

      let minions_increase = await profileModel.findOneAndUpdate({
        userID: message.author.id,
      }, {
        $inc: {
          minions: RANDOM_MINIONS,
        },
      });

      try {
        var arrayLength = LOCATIONS.length;
        for (var i = 0; i < arrayLength; i++) { //itterate through array LOCATIONS to find the matching Location
          if (m.content.toLowerCase() === LOCATIONS[i].toLowerCase()) {
            if (number <= success) {
              goldincrease
              return message.channel.send(SUCCESS_EMBED);
            } else if (number <= fail) {
              goldremove
              healthloss
              return message.channel.send(FAIL_EMBED);
            } else if (number <= special) {
              minions_increase
              return message.channel.send(SPECIAL_EMBED);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    COLLECTOR.on("end", (collected) => {
      if (collected.size == 0) {
        return message.channel.send(
          `What are you doing <@${message.author.id}>?! There was 💰${RANDOM_NUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} hidden inside the ${chosenLocations[0]} 😭\n Luckily you atleast Earned ${randomXP} XP`
        );
      }
    });

    message.channel.send(
      `<@${message.author.id
      }>\n**Which location would you like to search?** 🔍\nType the location in this channel.\n\`${chosenLocations.join("` `")}\``
    );
  }
};
