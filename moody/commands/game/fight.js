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

        // XP Reward: 300 - 300
        const randomXP = Math.floor(Math.random() * 300) + 300;

        const Contestants = [
            user,
            opponent
        ]

        // Choose a random winner
        const winner = Contestants.sort(() => Math.random() - Math.random()).slice(0, 1)[0];

        // Gold Reward: 1200 - 1500
        let WinningsNUMBER = Math.floor(Math.random() * 1500) + 1200;

        const FILTER = (m) => {
            let conclusions = {
                yes: m.content.toLowerCase().startsWith('y'), // Yes
                no: m.content.toLowerCase().startsWith('n'),  // No
                opponentMessage: m.author.id === opponent.id, // Opponent's message
                userMessage: m.author.id === user.id,         // User's message
                newCommand: m.content.startsWith(this.prefix) // New command issued
            }
            return (
                (conclusions.yes && conclusions.opponentMessage) ||         // Opponent says No
                (conclusions.no && conclusions.opponentMessage) ||          // Opponent says Yes
                (conclusions.no && conclusions.userMessage) ||              // User says No
                (conclusions.newCommand && conclusions.opponentMessage) ||  // Opponent issues new command
                (conclusions.newCommand && conclusions.userMessage)         // User issues new command
            )
        }

        // 30 secs to collect response
        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 30 * 1000 // 30 seconds
        });

        // When we're done collecting
        COLLECTOR.on("collect", async (m) => {
            // Bail if we try to start a new command
            if (m.content.startsWith(this.prefix)) {
                this.error = true
                this.numErrors += 1
                this.props.description = 'You are already in a command. Duel Cancelled!'
                return
            }

            // Bail if someone says no
            if (m.content.toLowerCase().startsWith('n')) {
                this.error = true
                this.numErrors += 1
                this.props.description = 'The Duel was Cancelled!'
                return
            }

            // XP Reward
            const hasLeveledUP = await this.db_transform(winner.id, "xp", randomXP);

            this.props.color = "#FF5000"
            this.props.title = "WINNER WINNER CHICKEN DINNER"
            this.props.description = [
                `<@${winner.id}> Won the Fight. Recieving ${this.emojis.gold}${WinningsNUMBER.toLocaleString("en-AU")} in Winnings!`,
                `<@${winner.id}> Earned ${this.emojis.xp}${randomXP} XP`
            ]

            // If fight was accepted
            if (m.content.toLowerCase().startsWith('y')) {
                // Give gold to winner
                await this.db_transform(winner.id, "gold", WinningsNUMBER)

                // Ding message
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

            // We'll handle sending it
            // SELFHANDLE: Collector Collected
            this.send(message, new VillainsEmbed(this.props));
            this.null = true
        });

        // Time's up!
        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                //cooldown = 0
                this.error = true
                this.props.description = `Nobody has answered. Duel Cancelled!`

                // We'll handle sending it
                // SELFHANDLE: Collector Timed Out
                this.send(message, new VillainsEmbed(this.props));
                this.null = true
            }
        });
    }
}
