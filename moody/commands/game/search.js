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
        const hasLeveledUP = await this.db_transform(loaded.id, "xp", randomXP);

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
        let Health_Loss = Math.floor(Math.random() * 10) + 1;

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
            let number = Math.round(Math.random() * 100);

            let success = 80;
            let fail = 95;
            let special = 100;

            let location = m.content.split(" ").map(x => x.charAt(0).toUpperCase() + x.slice(1))

            this.props.title.text = `${loaded.username} searched the ${location} 🕵️`

            if (hasLeveledUP) {
                const user = await this.db_query(loaded.id, "levels");
                let reward = {
                    gold: 1000,
                    minions: 1
                }
                await this.db_transform(loaded.id,
                    {
                        gold: reward.gold,
                        minions: reward.minions
                    }
                )
                this.props.footer.msg = [
                    `You just Advanced to Level ${user.level}!`,
                    `You have gained: ${this.emojis.gold}+${reward.gold} , ${this.emojis.minions}+${reward.minions}`
                ].join(" · ")
            }

            if (number <= success) {
                // Gold Increase
                await this.db_transform(loaded.id, "gold", RANDOM_NUMBER)

                this.props.color = this.props.success.color
                this.props.description = `You searched the ${location} and found...`
                this.props.fields = [
                    {
                        name: `${this.emojis.gold}${RANDOM_NUMBER.toLocaleString("en-AU")}`,
                        value: "Gold",
                        inline: true
                    },
                    {
                        name: `${this.emojis.xp}${randomXP.toLocaleString("en-AU")}`,
                        value: "XP",
                        inline: true
                    }
                ]
            } else if (number <= fail) {
                // Gold Decrease
                await this.db_transform(loaded.id, "gold", -RANDOM_NUMBER)

                // Health Decrease
                await this.db_transform(loaded.id, "health", -Health_Loss)

                this.props.color = this.props.fail.color
                this.props.description = [
                    `You searched the ${location} and got injured! This causes you to drop ${this.emojis.gold}${RANDOM_NUMBER}`,
                    `Maybe a bad idea or just Unlucky.`,
                    "",
                    `Earned...`
                ].join("\n")

                this.props.fields = [
                    {
                        name: `${this.emojis.xp}${randomXP.toLocaleString("en-AU")}`,
                        value: "XP",
                        inline: true
                    }
                ]

            } else if (number <= special) {
                // Minions Increase
                await this.db_transform(loaded.id, "minions", RANDOM_MINIONS)

                this.props.color = this.props.special.color
                this.props.description = [
                    `You go to search the ${location} and for some reason find **Minions** following you home.`,
                    "",
                    `Earned...`
                ].join("\n")
                this.props.fields = [
                    {
                        name: `${this.emojis.minions}${RANDOM_MINIONS.toLocaleString("en-AU")}`,
                        value: "Minions",
                        inline: true
                    },
                    {
                        name: `${this.emojis.xp}${randomXP.toLocaleString("en-AU")}`,
                        value: "XP",
                        inline: true
                    }
                ]
            }
            this.send(message, new VillainsEmbed(this.props))
            this.null = true
        });

        // Didn't get a response for Location to Search
        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                this.props.title.text = `${loaded.username} forgot to search anywhere! 🤦‍♀️`
                this.props.description = [
                    `What are you doing <@${loaded.id}>?! There was ${this.emojis.gold}${RANDOM_NUMBER} hidden inside the ${chosenLocations[0]} 😭`,
                    `Luckily you atleast Earned...`
                ].join("\n")
                this.props.fields = [
                    {
                        name: `${this.emojis.xp}${randomXP.toLocaleString("en-AU")}`,
                        value: "XP",
                        inline: true
                    }
                ]
                this.send(message, new VillainsEmbed(this.props))
                this.null = true
            }
        });
    }
}
