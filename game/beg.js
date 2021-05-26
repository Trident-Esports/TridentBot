const profileModel = require("../models/profileSchema");

const Levels = require('discord-xp');

module.exports = {
  name: "beg",
  aliases: [],
  permissions: [],
  cooldown: 60,
  description: "Begs for Coins",
  async execute(message, args, cmd, client, discord, profileData) {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
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


    const randomXP = Math.floor(Math.random() * 50) + 15;
    const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

    if (hasLeveledUP) {

      const user = await Levels.fetch(message.author.id);
      const target = message.author
      await profileModel.findOneAndUpdate(
        {
          userID: target.id,
        },
        {
          $inc: {
            gold: 1000,
            minions: 1
          },
        });


      message.channel.send(`${message.member} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
    }
    return message.channel.send(`${message.author.username} received ${randomNumber} **Gold**\n\nEarned ${randomXP} XP`);
  }
};