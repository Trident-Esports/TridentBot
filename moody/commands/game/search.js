const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');


module.exports = class SearchCommand extends GameCommand {
    //FIXME: Footer not updating?
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
        const loaded = this.inputData.loaded

        const randomXP = Math.floor(Math.random() * 200) + 50;
        const hasLeveledUP = await this.Levels.appendXp(loaded.id, 1, randomXP);

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

        this.props.title = { text: "Which location would you like to search? 🔍" }
        this.props.description = `\`${chosenLocations.join("`" + "\n" + "`")}\``

        const RANDOM_NUMBER = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        const RANDOM_MINIONS = Math.floor(Math.random() * 10) + 1;
        var Health_Loss = Math.floor(Math.random() * 10) + 1;

        const FILTER = (m) => {
            return chosenLocations.some((answer) => answer.split(" ").pop().toLowerCase() === m.content.split(" ").pop().toLowerCase()) && m.author.id === loaded.id;
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

        // Got a response for Location to Search
        COLLECTOR.on("collect", async (m) => {
            var number = Math.round(Math.random() * 100);

            var success = 80;
            var fail = 95;
            var special = 100;

            let location = m.content.split(" ").map(x => x.charAt(0).toUpperCase() + x.slice(1))

            this.props.title.text = `${loaded.username} searched the ${location} 🕵️`

            if (hasLeveledUP) {
                const user = await this.Levels.fetch(loaded.id, 1);
                let reward = {
                    gold: 1000,
                    minions: 1
                }
                await this.profileModel.findOneAndUpdate({
                    userID: loaded.id,
                }, {
                    $inc: {
                        gold: reward.gold,
                        minions: reward.minions
                    },
                });
                this.props.footer.msg = [
                    `You just Advanced to Level ${user.level}!`,
                    `You have gained: ${this.emojis.gold}+${reward.gold} , ${this.emojis.minions}+${reward.minions}`
                ].join(" · ")
            }

            if (number <= success) {
                // Gold Increase
                let inc = {
                    gold: RANDOM_NUMBER
                }
                await this.profileModel.findOneAndUpdate({
                    userID: loaded.id,
                }, {
                    $inc: inc,
                })

                this.props.color = this.props.success.color
                this.props.description = [
                    `You searched the ${location} and found ${this.emojis.gold}${RANDOM_NUMBER}`,
                    `Earned ${this.emojis.xp}${randomXP} XP`
                ].join("\n")
            } else if (number <= fail) {
                // Gold Decrease
                let inc = {
                    gold: -RANDOM_NUMBER
                }
                await this.profileModel.findOneAndUpdate({
                    userID: loaded.id,
                }, {
                    $inc: inc,
                })

                // Health Decrease
                inc = {
                    health: -Health_Loss
                }
                await this.healthModel.findOneAndUpdate({
                    userID: loaded.id,
                }, {
                    $inc: inc,
                })

                this.props.color = this.props.fail.color
                this.props.description = [
                    `You searched the ${location} and got injured! This causes you to drop ${this.emojis.gold}${RANDOM_NUMBER}`,
                    `Maybe a bad idea or just Unlucky.`,
                    "",
                    `Earned ${this.emojis.xp}${randomXP} XP and even more experience of not to do it again xD`
                ].join("\n")

            } else if (number <= special) {
                // Minions Increase
                let inc = {
                    minions: RANDOM_MINIONS
                }
                await this.profileModel.findOneAndUpdate({
                    userID: loaded.id,
                }, {
                    $inc: inc,
                })

                this.props.color = this.props.special.color
                this.props.description = [
                    `You go to search the ${location} and for some reason find ${this.emojis.minions}${RANDOM_MINIONS} Minions following you home.`,
                    "",
                    `Earned ${this.emojis.xp}${randomXP} XP`
                ].join("\n")
            }
            this.send(message, new VillainsEmbed(this.props))
            this.null = true
        });

        // Didn't get a response for Location to Search
        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                this.props.title.text = `${loaded.username} forgot to search anywhere! 🤦‍♀️`
                this.props.description = [
                    `What are you doing <@${loaded.id}>?! There was ${this.emojis.gold}${RANDOM_NUMBER} hidden inside the ${chosenLocations[0]} 😭\n Luckily you atleast Earned ${this.emojis.xp}${randomXP} XP`
                ].join("\n")
                this.send(message, new VillainsEmbed(this.props))
                this.null = true
            }
        });
    }
}
