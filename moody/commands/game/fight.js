const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class FightCommand extends GameCommand {
    constructor() {
        super({
            name: 'fight',
            aliases: ["battle"],
            cooldown: 60 * 60,
            category: 'game',
            description: 'Choose your player to fight and get bragging rights',
            extensions: ["levels", "profile"],
            flags: {
                user: "invalid"
            }
        });
    }

    async action(client, message) {
        // return message.channel.send("Temporarily disabled.")

        /*
        User:   Invalid
        Target: Valid
        Bot:    Invalid
        */
        let loaded = this.inputData.loaded

        let props = {
            title: {
                text: "🛡️⚔️ BATTLE ⚔️🛡️"
            },
            thumbnail: "https://gifimage.net/wp-content/uploads/2017/11/i-challenge-you-to-a-duel-gif-12.gif",
            description: `<@${message.author.id}> has commenced a duel with <@${loaded.id}>. Do you accept?`,
            footer: {
                msg: ""
            }
        }

        const randomXP = Math.floor(Math.random() * 300) + 300;

        const Contestants = [
            message.author.id,
            loaded.id,
        ];

        let chosenWinner = Contestants.sort(() => Math.random() - Math.random()).slice(0, 1);
        let WinningsNUMBER = Math.floor(Math.random() * 1500) + 1200;

        const FILTER = (m) => {
            let conclusions = {
                yes: m.content.toLowerCase().includes("yes") || m.content.toLowerCase().startsWith('y'),
                no: m.content.toLowerCase().includes("no") || m.content.toLowerCase().startsWith('n'),
                targetMessage: m.author.id === loaded.id,
                authorMessage: m.author.id === message.author.id,
                newCommand: m.content.startsWith(this.prefix)
            }
            return (
                (conclusions.yes && conclusions.targetMessage) ||
                (conclusions.no && conclusions.targetMessage) ||
                (conclusions.no && conclusions.authorMessage) ||
                (conclusions.newCommand && conclusions.targetMessage) ||
                (conclusions.newCommand && conclusions.authorMessage)
            )
        }

        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 30 * 1000 // 30 seconds
        });

        COLLECTOR.on("collect", async (m) => {

            const hasLeveledUP = await this.db_transform(message.author.id, "xp", randomXP);

            props.color = "#FF5000"
            props.title = "WINNER WINNER CHICKEN DINNER"
            props.description = [
                `<@${chosenWinner}> Won the Fight. Recieving ${this.emojis.gold}${WinningsNUMBER.toLocaleString("en-AU")} in Winnings!`,
                `<@${message.author.id}> Earned ${this.emojis.xp}${randomXP} XP`
            ]

            if (m.content.startsWith(this.prefix)) {
                props.error = true
                props.description = 'You are already in a command. Please end this first!'
            }

            if (m.content.toLowerCase() === 'yes' || m.content.toLowerCase().startsWith('y')) {
                await this.db_transform(chosenWinner, "gold", WinningsNUMBER)

                if (hasLeveledUP) {
                    const user = await this.db_query(message.author.id, "levels");
                    const target = message.author
                    let reward = {gold: 1000, minions: 1}
                    await this.db_transform(target.id, { gold: reward.gold, minions: reward.minions })

                    props.footer.msg = [
                        `${message.author.username} You just Advanced to Level ${user.level}!`,
                        `You have gained: ${this.emojis.gold}${reward.gold}, ${this.emojis.minions}${reward.minions}`
                    ].join(" * ")
                }
            }

            if (m.content.toLowerCase() === 'no' || m.content.toLowerCase().startsWith('n')) {
                props.error = true
                props.description = 'The Duel was Cancelled!'
            }

            let embed = new VillainsEmbed(props)
            this.send(message, embed);
            this.null = true
        });

        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                //cooldown = 0
                props.error = true
                props.description = `Nobody has answered. Duel Cancelled!`

                let embed = new VillainsEmbed(props)
                this.send(message, embed);
                this.null = true
            }
        });

        let embed = new VillainsEmbed(props)
        this.send(message, embed);
    }
}
