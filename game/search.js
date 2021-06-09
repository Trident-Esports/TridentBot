const profileModel = require("../models/profileSchema");

const healthModel = require('../models/healthSchema');

const Levels = require('discord-xp');

module.exports = {
  name: "search",
  aliases: [],
  permissions: ["SEND_MESSAGES"],
  cooldown: 60 * 5,
  category: "economy",
  description: {
    usage: ".search",
    content: "Choose your search location and have a chance at some gold!",
    examples: [".search"],
  },
  async execute(message, args, alias, client, discord, profileData) {

    const randomXP = Math.floor(Math.random() * 200) + 50;
    const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);
    const target = await Levels.fetch(message.author.id, message.guild.id);

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

    if(target.level <= 10) {
      Health_Loss = Math.floor(Math.random() * 10) + 1;
    } else if(target.level > 10) {
      Health_Loss = 0;
    } 


    const FILTER = (m) => {
      return chosenLocations.some((answer) => answer.toLowerCase() === m.content.toLowerCase()) && m.author.id === message.author.id;
    };

    const COLLECTOR = message.channel.createMessageCollector(FILTER, { max: 1, time: 25000 });

    COLLECTOR.on("collect", async (m) => {

      var number = Math.round(Math.random() * 100);

      var success = 80;
      var fail = 95;
      var special = 100;

      console.log(number);

      const SUCCESS_EMBED = new discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${message.author.username} searched the ${m.content} 🕵️`)
        .setDescription(`You searched the ${m.content} and found 💰${RANDOM_NUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold\n\nEarned ${randomXP} XP`)
        .setTimestamp();

      const FAIL_EMBED = new discord.MessageEmbed()
        .setColor("RED")
        .setTitle(`${message.author.username} searched the ${m.content} 🕵️`)
        .setDescription(`You searched the ${m.content} and got injured! This causes you to drop ${RANDOM_NUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold.\n Maybe a bad idea or just Unlucky.\n\nEarned ${randomXP} XP and even more experience of not to do it again xD`)
        .setTimestamp();

      const SPECIAL_EMBED = new discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`${message.author.username} searched the ${m.content} 🕵️`)
        .setDescription(`You go to search the ${m.content} and for some reason find ${RANDOM_MINIONS} Minions following you home.\n\nEarned ${randomXP} XP`)
        .setTimestamp()

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
        SUCCESS_EMBED.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
        FAIL_EMBED.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
        SPECIAL_EMBED.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
      }

      try {

        if (m.content.toLowerCase() === 'forest') {

          if (number <= success) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: RANDOM_NUMBER,
                },
              }
            );
            return message.channel.send(SUCCESS_EMBED)
          }
          else if (number <= fail) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: -RANDOM_NUMBER,
                },
              });
            await healthModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  health: -Health_Loss,
                },
              });
            return message.channel.send(FAIL_EMBED);
          }

          else if (number <= special) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  minions: RANDOM_MINIONS,
                },
              });
            return message.channel.send(SPECIAL_EMBED);
          }
        } if (m.content.toLowerCase() === 'sewer') {

          if (number <= success) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: RANDOM_NUMBER,
                },
              }
            );
            return message.channel.send(SUCCESS_EMBED);
          }

          else if (number <= fail) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: -RANDOM_NUMBER,
                },
              });
            await healthModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  health: -Health_Loss,
                },
              });
            return message.channel.send(FAIL_EMBED);
          }

          else if (number <= special) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  minions: RANDOM_MINIONS,
                },
              });
            return message.channel.send(SPECIAL_EMBED);
          }
        } if (m.content.toLowerCase() === 'cave') {

          if (number <= success) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: RANDOM_NUMBER,
                },
              }
            );
            return message.channel.send(SUCCESS_EMBED);
          }
          else if (number <= fail) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: -RANDOM_NUMBER,
                },
              });
            await healthModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  health: -Health_Loss,
                },
              });
            return message.channel.send(FAIL_EMBED);
          }

          else if (number <= special) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  minions: RANDOM_MINIONS,
                },
              });
            return message.channel.send(SPECIAL_EMBED);
          }

        } if (m.content.toLowerCase() === 'mansion') {

          if (number <= success) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: RANDOM_NUMBER,
                },
              }
            );
            return message.channel.send(SUCCESS_EMBED);
          }
          else if (number <= fail) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: -RANDOM_NUMBER,
                },
              });
            await healthModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  health: -Health_Loss,
                },
              });
            return message.channel.send(FAIL_EMBED);
          }

          else if (number <= special) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  minions: RANDOM_MINIONS,
                },
              });
            return message.channel.send(SPECIAL_EMBED);
          }

        } if (m.content.toLowerCase() === 'dungeon') {

          if (number <= success) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: RANDOM_NUMBER,
                },
              }
            );
            return message.channel.send(SUCCESS_EMBED);
          }

          else if (number <= fail) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: -RANDOM_NUMBER,
                },
              });
            await healthModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  health: -Health_Loss,
                },
              });
            return message.channel.send(FAIL_EMBED);
          }

          else if (number <= special) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  minions: RANDOM_MINIONS,
                },
              });
            return message.channel.send(SPECIAL_EMBED);
          }

        } if (m.content.toLowerCase() === 'graveyard') {

          if (number <= success) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: RANDOM_NUMBER,
                },
              }
            );
            return message.channel.send(SUCCESS_EMBED);
          }
          else if (number <= fail) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: -RANDOM_NUMBER,
                },
              });
            await healthModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  health: -Health_Loss,
                },
              });
            return message.channel.send(FAIL_EMBED);
          }

          else if (number <= special) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  minions: RANDOM_MINIONS,
                },
              });
            return message.channel.send(SPECIAL_EMBED);
          }

        } if (m.content.toLowerCase() === 'abandoned mine') {

          if (number <= success) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: RANDOM_NUMBER,
                },
              }
            );
            return message.channel.send(SUCCESS_EMBED);
          }
          else if (number <= fail) {
            await profileModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  gold: -RANDOM_NUMBER,
                },
              });
            await healthModel.findOneAndUpdate(
              {
                userID: message.author.id,
              },
              {
                $inc: {
                  health: -Health_Loss,
                },
              });
            return message.channel.send(FAIL_EMBED);
          }
        }

        else if (number <= special) {
          await profileModel.findOneAndUpdate(
            {
              userID: message.author.id,
            },
            {
              $inc: {
                minions: RANDOM_MINIONS,
              },
            });
          return message.channel.send(SPECIAL_EMBED);
        }

      }
      catch (err) {
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