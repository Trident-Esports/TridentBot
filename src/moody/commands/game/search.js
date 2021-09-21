//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');

module.exports = class SearchCommand extends GameCommand {
    //FIXME: Footer not updating?
    constructor(client) {
        let comprops = {
            name: 'search',
            group: 'game',
            memberName: 'search',
            description: 'Choose your search location and have a chance at some Gold!',
            guildOnly: true
        }
        super(
            client,
            {...comprops},
            {
                extensions: ["profile", "levels", "health"]
            }
        )
    }

    async action(client, message) {
        // Get loaded target
        const loaded = this.inputData.loaded

        // XP Reward: 50 - 200
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

        // Pick 3 random locations
        let chosenLocations = LOCATIONS.sort(() => Math.random() - Math.random()).slice(0, 3);

        this.props.title = { text: "Which location would you like to search? 🔍" }
        this.props.description = `\`${chosenLocations.join("`" + "\n" + "`")}\``

        // Gold Reward: 100 - 1000
        const RANDOM_NUMBER = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        // Minion Reward: 1 - 10
        const RANDOM_MINIONS = Math.floor(Math.random() * 10) + 1;
        // Health Cost: 1 - 10
        let Health_Loss = Math.floor(Math.random() * 10) + 1;

        // Match answer
        const FILTER = (m) => {
            return chosenLocations.some(
                (answer) => answer.split(" ").pop().toLowerCase() === m.content.split(" ").pop().toLowerCase()
            ) &&
            m.author.id === loaded.id;
        };

        // const COLLECTOR = message.channel.createMessageCollector({FILTER, // discord.js v13
        // 25 seconds to collect
        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 25000
        });

        // Special stripes
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

            // Ding message
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
                this.props.description += [
                    `You just Advanced to Level ${user.level}!`,
                    `You have gained: ${this.emojis.gold}+${reward.gold} , ${this.emojis.minions}+${reward.minions}`
                ].join(" • ")
            }

            // Success
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
                // Fail
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
                // ??? PROFIT
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
            // We'll handle sending it
            // SELFHANDLE: Collector Collected
            this.send(message, new VillainsEmbed({...this.props}))
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

                // We'll handle sending it
                // SELFHANDLE: Collector Timed Out
                this.send(message, new VillainsEmbed({...this.props}))
                this.null = true
            }
        });
    }
}
