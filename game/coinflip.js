const profileModel = require("../models/profileSchema");
const Levels = require('discord-xp');
const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "coinflip",
    aliases: ['cf'],
    permissions: [],
    cooldown: 5,
    description: "Coinflip for coins",
    async execute(message, args, profileData) {

        const randomXP = Math.floor(Math.random() * 9) + 1;
        const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

        var gambledAmount = args[0].toLowerCase()

        //if command is just .cf comes up with tolowercase of undefined need to send a message saying type an amount to gamble.

        if (gambledAmount == 'all') gambledAmount = profileData.gold;
        if (gambledAmount == 'half') gambledAmount = profileData.gold / 2;

        if (gambledAmount > profileData.gold) return message.channel.send('You seem to be abit short on money there');

        if (gambledAmount < 500) return message.channel.send('You must gamble atleast 💰500!');

        if (isNaN(gambledAmount)) return message.channel.send(`${message.author}, the correct usage of this command is \`.cf [$]\`.\nSee what you can buy with \`.shop\``);

        const variables = [
            "Heads",
            "Tails",
            "Side",
        ];

        let chosenVariable = variables.sort(() => Math.random() - Math.random()).slice(0, 3);

        const RANDOM_MINIONS = Math.floor(Math.random() * 2) + 1;

        const FILTER = (m) => {
            return chosenVariable.some((answer) => answer.toLowerCase() === m.content.toLowerCase()) && m.author.id === message.author.id;
        };

        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 15000
        });

        let props = {
            "title": "**Coin Flip**",
            "thumbnail": "https://media.tenor.com/images/60b3d58b8161ad9b03675abf301e8fb4/tenor.gif",
            "coinflip": "**Which side of the coin do you think it will land on?** 🔍",
            "success": {
                "embedColor": "#00FF00",
                "title": "**CONGRATULATIONS**",
            },
            "fail": {
                "embedColor": "#FF0000",
                "title": "**SADNESS**",
            },
            "special": {
                "embedColor": "#0000FF",
                "title": "**OMG**",
            },
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }
        let thumbnail = {
            "image": "https://media.tenor.com/images/60b3d58b8161ad9b03675abf301e8fb4/tenor.gif"
        }

        COLLECTOR.on("collect", async (m) => {

            var number = Math.round(Math.random() * 100);

            var Heads = 50;
            var Tails = 50;
            var Side = 2;

            const COINFLIP_EMBED = new MessageEmbed()
                .setTimestamp();

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
                let gainedmoney = level_gain * 1000
                let gainedminions = level_gain * 100

                SUCCESS_EMBED.setFooter(`${target.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+${gainedmoney} , 🐵+${gainedminions}`)
                FAIL_EMBED.setFooter(`${target.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+${gainedmoney} , 🐵+${gainedminions}`)
                SPECIAL_EMBED.setFooter(`${target.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+${gainedmoney} , 🐵+${gainedminions}`)
            }

            try {
                if (number <= Heads && m.content.toLowerCase() === 'heads') {
                    await profileModel.findOneAndUpdate({
                        userID: message.author.id,
                    }, {
                        $inc: {
                            gold: gambledAmount,
                        },
                    });
                    console.log(number)
                    COINFLIP_EMBED.setColor(props["success"]["embedColor"])
                    COINFLIP_EMBED.setTitle(props["success"]["title"])
                    COINFLIP_EMBED.setDescription(`You chose ${m.content} and won 💰${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n\nEarned ${randomXP} XP`)
                    return message.channel.send(COINFLIP_EMBED);
                }
                else if (number <= Tails && m.content.toLowerCase() === 'tails') {
                    await profileModel.findOneAndUpdate({
                        userID: message.author.id,
                    }, {
                        $inc: {
                            gold: gambledAmount,
                        },
                    });
                    console.log(number)
                    COINFLIP_EMBED.setColor(props["success"]["embedColor"])
                    COINFLIP_EMBED.setTitle(props["success"]["title"])
                    COINFLIP_EMBED.setDescription(`You chose ${m.content} and won 💰${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n\nEarned ${randomXP} XP`)
                    return message.channel.send(COINFLIP_EMBED);

                }
                else if (number <= Side && m.content.toLowerCase() === 'side') {
                    await profileModel.findOneAndUpdate({
                        userID: message.author.id,
                    }, {
                        $inc: {
                            gold: -1,
                            minions: RANDOM_MINIONS,
                        },
                    });
                    console.log(number)
                    COINFLIP_EMBED.setColor(props["special"]["embedColor"])
                    COINFLIP_EMBED.setTitle(props["special"]["title"])
                    COINFLIP_EMBED.setDescription(`You go to flip the coin and it lands on its ${m.content} and for some reason you find ${RANDOM_MINIONS} Minions grabbing the coin.\n\nThey are now yours\n\nEarned ${randomXP} XP.`)
                    return message.channel.send(COINFLIP_EMBED);
                } else {
                    winmoney
                    console.log(number)
                    COINFLIP_EMBED.setColor(props["fail"]["embedColor"])
                    COINFLIP_EMBED.setTitle(props["fail"]["title"])
                    COINFLIP_EMBED.setDescription(`You chose ${m.content} and the coin didn't land on that. this means you just lost ${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} gold.\n Maybe a bad idea or just Unlucky.\n\nOn the bright side you Earned ${randomXP} XP`)
                    message.channel.send(COINFLIP_EMBED);
                }
            } catch (err) {
                console.log(err)
            }
            console.log(number)
        });

        COLLECTOR.on("end", async (collected) => {
            if (collected.size == 0) {
                await profileModel.findOneAndUpdate({
                    userID: message.author.id,
                }, {
                    $inc: {
                        gold: -1,
                    },
                });
                return message.channel.send(`${message.author} forgets to flip the coin and it falls out of their hand and rolls away. Losing 💰1.`);
            }
        });

        const Choose_embed = new MessageEmbed()
            .setTitle(props["title"])
            .setDescription(`<@${message.author.id}>\n${props["coinflip"]}\n\`${chosenVariable.join("` `")}\``)
            .setThumbnail(thumbnail["image"])
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send(Choose_embed);
    }
};
