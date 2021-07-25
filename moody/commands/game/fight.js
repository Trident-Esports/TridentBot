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
        let user = this.inputData.user
        let opponent = this.inputData.loaded

        this.numErrors = 0
        this.props.title.text = "🛡️⚔️ BATTLE ⚔️🛡️"
        this.props.image = "https://gifimage.net/wp-content/uploads/2017/11/i-challenge-you-to-a-duel-gif-12.gif"
        this.props.description = [
            `*Hey <@${opponent.id}>!*`,
            "",
            `The gauntlet has been thrown by <@${user.id}> and they have commenced a duel with you!`,
            "",
            `Do you accept?`
        ]

        const randomXP = Math.floor(Math.random() * 300) + 300;

        const Contestants = [
            user,
            opponent
        ]

        const winner = Contestants.sort(() => Math.random() - Math.random()).slice(0, 1)[0];
        let WinningsNUMBER = Math.floor(Math.random() * 1500) + 1200;

        const FILTER = (m) => {
            let conclusions = {
                yes: m.content.toLowerCase().includes("yes") || m.content.toLowerCase().startsWith('y'),
                no: m.content.toLowerCase().includes("no") || m.content.toLowerCase().startsWith('n'),
                opponentMessage: m.author.id === opponent.id,
                userMessage: m.author.id === user.id,
                newCommand: m.content.startsWith(this.prefix)
            }
            return (
                (conclusions.yes && conclusions.opponentMessage) ||
                (conclusions.no && conclusions.opponentMessage) ||
                (conclusions.no && conclusions.userMessage) ||
                (conclusions.newCommand && conclusions.opponentMessage) ||
                (conclusions.newCommand && conclusions.userMessage)
            )
        }

        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 30 * 1000 // 30 seconds
        });

        COLLECTOR.on("collect", async (m) => {
            if (m.content.startsWith(this.prefix)) {
                this.error = true
                this.numErrors += 1
                this.props.description = 'You are already in a command. Duel Cancelled!'
                return
            }

            if (m.content.toLowerCase() === 'no' || m.content.toLowerCase().startsWith('n')) {
                this.error = true
                this.numErrors += 1
                this.props.description = 'The Duel was Cancelled!'
                return
            }

            if (!(this.error)) {
                const hasLeveledUP = await this.db_transform(winner.id, "xp", randomXP);

                this.props.color = "#FF5000"
                this.props.title = "WINNER WINNER CHICKEN DINNER"
                this.props.description = [
                    `<@${winner.id}> Won the Fight. Recieving ${this.emojis.gold}${WinningsNUMBER.toLocaleString("en-AU")} in Winnings!`,
                    `<@${winner.id}> Earned ${this.emojis.xp}${randomXP} XP`
                ]

                if (m.content.toLowerCase() === 'yes' || m.content.toLowerCase().startsWith('y')) {
                    await this.db_transform(winner.id, "gold", WinningsNUMBER)

                    if (hasLeveledUP) {
                        const levelData = await this.db_query(winner.id, "levels");
                        let reward = {gold: 1000, minions: 1}
                        await this.db_transform(winner.id, { gold: reward.gold, minions: reward.minions })

                        this.props.footer.msg = [
                            `${winner.username}: You just Advanced to Level ${levelData.level}!`,
                            `You have gained: ${this.emojis.gold}${reward.gold}, ${this.emojis.minions}${reward.minions}`
                        ].join(" • ")
                    }
                }
            }

            let embed = new VillainsEmbed(this.props)
            this.send(message, embed);
            this.null = true
        });

        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                //cooldown = 0
                this.error = true
                this.props.description = `Nobody has answered. Duel Cancelled!`

                let embed = new VillainsEmbed(this.props)
                this.send(message, embed);
                this.null = true
            }
        });
    }
}
