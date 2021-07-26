const GameCommand = require('../../classes/gamecommand.class');

module.exports = class BegCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'beg',
            category: 'game',
            description: 'beg for gold',
            extensions: [ "levels", "profile" ]
        }
        super(comprops)
    }

    async action(client, message) {
        // Get loaded target
        const loaded = this.inputData.loaded

        // Gold Reward: 1 - 50
        let [minReward, maxReward] = [1, 50]
        const randomNumber = Math.floor(Math.random() * (maxReward - minReward)) + minReward;

        // XP Reward: 15 - 50
        let [minXP, maxXP] = [15, 50]
        const randomXP = Math.floor(Math.random() * (maxXP - minXP)) + minXP;

        // Add Gold reward
        await this.db_transform(loaded.id, "gold", randomNumber)

        // Add XP reward
        const hasLeveledUP = await this.db_transform(loaded.id, "xp", randomXP)

        // Ding message
        if (hasLeveledUP) {
            const levelData = await this.db_query(loaded.id, "levels");
            // Gold Reward: 1000, Minion Reward: 1
            let gainedmoney = 1000
            let gainedminions = 1
            let inc = {
                gold: gainedmoney,
                minions: gainedminions
            }
            await this.db_transform(loaded.id, inc)

            let msg = [
                `You just Advanced to Level ${levelData.level.toLocaleString("en-AU")}!`,
                `You have gained: ${this.emojis.gold}${gainedmoney.toLocaleString("en-AU")}, ${this.emojis.minions}${gainedminions.toLocaleString("en-AU")}`
            ].join(" • ")

            this.props.footer.msg = msg
        }

        this.props.description = `*<@${loaded.id}> begs and receives...*`
        this.props.fields = [
            {
                name: `${this.emojis.gold}${randomNumber.toLocaleString("en-AU")}`,
                value: "Gold",
                inline: true
            },
            {
                name: `${this.emojis.xp}${randomXP.toLocaleString("en-AU")}`,
                value: "XP",
                inline: true
            }
        ]
    }
}
