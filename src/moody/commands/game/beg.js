//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');

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
        const loaded = this.inputData.loaded

        if (!(this.error)) {
            // Gold Reward: 1 - 50
            let [minReward, maxReward] = [1, 50]
            const randomNumber = Math.floor(Math.random() * (maxReward - minReward)) + minReward;

            // XP Reward: 15 - 50
            let [minXP, maxXP] = [15, 50]
            const randomXP = Math.floor(Math.random() * (maxXP - minXP)) + minXP;

            await this.db_transform(loaded.id, "gold", randomNumber)

            const hasLeveledUP = await this.db_transform(loaded.id, "xp", randomXP)

            if (hasLeveledUP) {

                const levelData = await this.db_query(loaded.id, "levels");
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

    async test(client, message) {
        let dummy = null
        dummy = new BegCommand()
        dummy.run(client, message, [], null, "")
    }
}
