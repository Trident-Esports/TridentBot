const profileModel = require("../models/profileSchema");

const Levels = require('discord-xp');

module.exports = {
    name: "coinflip",
    aliases: ['cf'],
    permissions: [],
    cooldown: 5,
    description: "Coinflip for coins",
    async execute(message, args, cmd, client, discord, profileData) {

        const randomXP = Math.floor(Math.random() * 9) + 1;
        const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

        var gambledAmount = args[0].toLowerCase()

        if (gambledAmount == 'all') gambledAmount = profileData.gold;
        if (gambledAmount == 'half') gambledAmount = profileData.gold/2;

        if (!args.length) return message.channel.send('How much would you like to place on a coinflip?');

        if (gambledAmount > profileData.gold) return message.channel.send('You seem to be abit short on money there');

        if (gambledAmount < 500) return message.channel.send('You must have atleast 💰500 to gamble!');

        if (isNaN(gambledAmount)) return; //message.channel.send('You must type a real amount of gold to gamble.');

        const variables = [
            "Heads",
            "tails",
            "Side",
        ];

        let chosenVariable = variables.sort(() => Math.random() - Math.random()).slice(0, 3);

        const RANDOM_MINIONS = Math.floor(Math.random() * 2) + 1;

        const FILTER = (m) => {
            return chosenVariable.some((answer) => answer.toLowerCase() === m.content.toLowerCase()) && m.author.id === message.author.id;
        };

        const COLLECTOR = message.channel.createMessageCollector(FILTER, { max: 1, time: 15000 });

        COLLECTOR.on("collect", async (m) => {

            var number = Math.round(Math.random() * 100);

            var Heads = 50;
            var Tails = 50;
            var Side = 2;
            const SUCCESS_EMBED = new discord.MessageEmbed()
                .setColor("GREEN")
                .setTitle(`**CONGRATULATIONS**`)
                .setDescription(`You chose ${m.content} and won 💰${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n\nEarned ${randomXP} XP`)
                .setTimestamp();

            const FAIL_EMBED = new discord.MessageEmbed()
                .setColor("RED")
                .setTitle(`**SADNESS**`)
                .setDescription(`You chose ${m.content} and the coin didn't land on that. this means you just lost ${gambledAmount} gold.\n Maybe a bad idea or just Unlucky.\n\nOn the bright side you Earned ${randomXP} XP`)
                .setTimestamp();

            const SPECIAL_EMBED = new discord.MessageEmbed()
                .setColor("BLUE")
                .setTitle(`**OMG**`)
                .setDescription(`You go to flip the coin and it lands on its ${m.content} and for some reason you find ${RANDOM_MINIONS} Minions grabbing the coin.\n\nThey are now yours\n\nEarned ${randomXP} XP.`)
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
                if (number <= Heads && m.content.toLowerCase() === 'heads') {
                    await profileModel.findOneAndUpdate(
                        {
                            userID: message.author.id,
                        },
                        {
                            $inc: {
                                gold: gambledAmount,
                            },
                        }
                    );
                    console.log(number)
                    return message.channel.send(SUCCESS_EMBED)

                }
                else if (number <= Tails && m.content.toLowerCase() === 'tails') {
                    await profileModel.findOneAndUpdate(
                        {
                            userID: message.author.id,
                        },
                        {
                            $inc: {
                                gold: gambledAmount,
                            },
                        });
                    console.log(number)
                    return message.channel.send(SUCCESS_EMBED)

                }
                else if (number <= Side && m.content.toLowerCase() === 'side') {
                    await profileModel.findOneAndUpdate(
                        {
                            userID: message.author.id,
                        },
                        {
                            $inc: {
                                gold: -1,
                                minions: RANDOM_MINIONS,
                            },
                        });
                    console.log(number)
                    return message.channel.send(SPECIAL_EMBED);
                }
                else {
                    await profileModel.findOneAndUpdate(
                        {
                            userID: message.author.id,
                        },
                        {
                            $inc: {
                                gold: -gambledAmount,
                            },
                        })
                    console.log(number)
                    message.channel.send(FAIL_EMBED);


                }
            }
            catch (err) {
                console.log(err)
            }
            console.log(number)
        });

        let props = {
            "title": "**Coin Flip**",
            "thumbnail": "https://media.tenor.com/images/60b3d58b8161ad9b03675abf301e8fb4/tenor.gif"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const Choose_embed = new discord.MessageEmbed()
            .setTitle(props["title"])
            .setDescription(`<@${message.author.id}>\n**Which side of the coin do you think it will land on?** 🔍\n\`${chosenVariable.join("` `")}\``)
            .setThumbnail(message.author.avatarURL({ dynamic: true, format: 'png'}))
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send(Choose_embed);
    }

};
