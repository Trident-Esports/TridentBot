const profileModel = require("../models/profileSchema");
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

        var gambledAmount = args[0].toLowerCase() || args[0]

        //if command is just .cf comes up with tolowercase of undefined need to send a message saying type an amount to gamble.

        if (gambledAmount == 'all') {
            gambledAmount = profileData.gold
        }
        if (gambledAmount == 'half') {
            gambledAmount = profileData.gold / 2
        }

        if (gambledAmount > profileData.gold) return message.channel.send('You seem to be abit short on money there');

        if (gambledAmount < 500) return message.channel.send('You must gamble atleast 💰500!');

        if (isNaN(gambledAmount) || undefined) return message.channel.send(`${message.author}, the correct usage of this command is \`.cf [$]\`.\nSee what you can buy with \`.shop\``);

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

            try {
                let gotHeads = number <= Heads && m.content.toLowerCase() === 'heads';
                let gotTails = number <= Tails && m.content.toLowerCase() === 'tails';
                if (gotHeads || gotTails) {
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
                    COINFLIP_EMBED.setDescription(`You chose ${m.content} and won 💰${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.`)
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
                    COINFLIP_EMBED.setDescription(`You go to flip the coin and it lands on its ${m.content} and for some reason you find ${RANDOM_MINIONS} Minions grabbing the coin.\n\nThey are now yours!`)
                    return message.channel.send(COINFLIP_EMBED);
                } else {
                    await profileModel.findOneAndUpdate({
                        userID: message.author.id,
                    }, {
                        $inc: {
                            gold: -gambledAmount,
                        },
                    });
                    console.log(number)
                    COINFLIP_EMBED.setColor(props["fail"]["embedColor"])
                    COINFLIP_EMBED.setTitle(props["fail"]["title"])
                    COINFLIP_EMBED.setDescription(`You chose ${m.content} and the coin didn't land on that. this means you just lost 💰${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n Maybe a bad idea or just Unlucky.`)
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
