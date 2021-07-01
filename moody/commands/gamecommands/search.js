const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');


module.exports = class CoinFlipCommand extends GameCommand {
    constructor() {
        super({
            name: 'search',
            category: 'game',
            description: 'Choose your search location and have a chance at some gold!',
            extensions: ["profile", "levels", "health"]
        });
    }

    async run(client, message, args) {

        let props = {
            title: {
                text: "Coin Flip"
            },
            description: "**Which location would you like to search?**🔍",
            thumbnail: "",
            footer: {
                msg: ""
            }
        }

        const randomXP = Math.floor(Math.random() * 200) + 50;
        const hasLeveledUP = await this.Levels.appendXp(message.author.id, 1, randomXP);

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

        props["success"] = {
            "color": "#00FF00"
        }
        props["fail"] = {
            "color": "#FF0000"
        }
        props["special"] = {
            "color": "#0000FF"
        }

        COLLECTOR.on("collect", async (m) => {

            var number = Math.round(Math.random() * 100);

            var success = 80;
            var fail = 95;
            var special = 100;

            props.title.text = `${message.author.username} searched the ${m.content} 🕵️`

            if (hasLeveledUP) {

                const user = await this.Levels.fetch(message.author.id, 1);
                const target = message.author
                await this.profileModel.findOneAndUpdate({
                    userID: target.id,
                }, {
                    $inc: {
                        gold: 1000,
                        minions: 1
                    },
                });
                props.footer.msg = `${message.author.username} You just Advanced to Level ${user.level}!
                You have gained: 💰+1000 , 🐵+1`
            }

            let goldincrease = await this.profileModel.findOneAndUpdate({
                userID: message.author.id,
            }, {
                $inc: {
                    gold: RANDOM_NUMBER,
                },
            });

            let goldremove = await this.profileModel.findOneAndUpdate({
                userID: message.author.id,
            }, {
                $inc: {
                    gold: -RANDOM_NUMBER,
                },
            });

            let healthloss = await this.healthModel.findOneAndUpdate({
                userID: message.author.id,
            }, {
                $inc: {
                    health: -Health_Loss,
                },
            });

            let minions_increase = await this.profileModel.findOneAndUpdate({
                userID: message.author.id,
            }, {
                $inc: {
                    minions: RANDOM_MINIONS,
                },
            });

            var arrayLength = LOCATIONS.length;
            for (var i = 0; i < arrayLength; i++) { //itterate through array LOCATIONS to find the matching Location
                if (m.content.toLowerCase() === LOCATIONS[i].toLowerCase()) {
                    if (number <= success) {
                        goldincrease

                        props.color = props.success.color
                        props.description = `You searched the ${m.content} and found 💰${RANDOM_NUMBER.toString()}

                        Earned ${randomXP} XP`
                    } else if (number <= fail) {
                        goldremove
                        healthloss

                        props.color = props.fail.color
                        props.description = `You searched the ${m.content} and got injured! This causes you to drop ${RANDOM_NUMBER.toString()}
                        Maybe a bad idea or just Unlucky.

                        Earned ${randomXP} XP and even more experience of not to do it again xD`
                    } else if (number <= special) {
                        minions_increase

                        props.color = props.special.color
                        props.desscription = `You go to search the ${m.content} and for some reason find ${RANDOM_MINIONS} Minions following you home.

                        Earned ${randomXP} XP`
                    }

                    let embed = new VillainsEmbed(props)
                    await this.send(message, embed);
                }
            }

        });

        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                return message.reply(
                    `What are you doing <@${message.author.id}>?! There was 💰${RANDOM_NUMBER.toString()} hidden inside the ${chosenLocations[0]} 😭\n Luckily you atleast Earned ${randomXP} XP`
                );
            }
        });

        props.description = `<@${message.author.id}>` + props.description + `\`${chosenLocations.join("` `")}\``

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};
