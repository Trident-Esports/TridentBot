const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');


module.exports = class CoinFlipCommand extends GameCommand {
    //FIXME: Double post?
    constructor() {
        let comprops = {
            name: 'search',
            category: 'game',
            description: 'Choose your search location and have a chance at some gold!',
            extensions: ["profile", "levels", "health"]
        }
        super(comprops)
    }

    async action(client, message) {

        this.props.title = {}
        this.props.description = "**Which location would you like to search?**🔍"

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

        this.props["success"] = {
            "color": "#00FF00"
        }
        this.props["fail"] = {
            "color": "#FF0000"
        }
        this.props["special"] = {
            "color": "#0000FF"
        }

        COLLECTOR.on("collect", async (m) => {

            var number = Math.round(Math.random() * 100);

            var success = 80;
            var fail = 95;
            var special = 100;

            this.props.title.text = `${message.author.username} searched the ${m.content} 🕵️`

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
                this.props.footer.msg = [
                    `${message.author.username} You just Advanced to Level ${user.level}!`,
                    `You have gained: 💰+1000 , 🐵+1`
                ].join(" · ")
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

                        this.props.color = this.props.success.color
                        this.props.description = [
                            `You searched the ${m.content} and found ${this.emojis.gold}${RANDOM_NUMBER}`,
                            `Earned ${this.emojis.xp}${randomXP} XP`
                        ].join("\n")
                    } else if (number <= fail) {
                        goldremove
                        healthloss

                        this.props.color = this.props.fail.color
                        this.props.description = [
                            `You searched the ${m.content} and got injured! This causes you to drop ${this.emojis.gold}${RANDOM_NUMBER}`,
                            `Maybe a bad idea or just Unlucky.`,
                            "",
                            `Earned ${this.emojis.xp}${randomXP} XP and even more experience of not to do it again xD`
                        ].join("\n")

                    } else if (number <= special) {
                        minions_increase

                        this.props.color = this.props.special.color
                        this.props.desscription = [
                            `You go to search the ${m.content} and for some reason find ${this.emojis.minions}${RANDOM_MINIONS} Minions following you home.`,
                            "",
                            `Earned ${this.emojis.xp}${randomXP} XP`
                        ].join("\n")
                    }
                }
            }
            this.send(message, new VillainsEmbed(this.props))
        });

        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                return message.reply(
                    `What are you doing <@${message.author.id}>?! There was ${this.emojis.gold}${RANDOM_NUMBER} hidden inside the ${chosenLocations[0]} 😭\n Luckily you atleast Earned ${this.emojis.xp}${randomXP} XP`
                );
            }
            this.send(message, new VillainsEmbed(this.props))
        });

        this.props.description = `<@${message.author.id}>` + this.props.description + `\`${chosenLocations.join("` `")}\``
    }
}
