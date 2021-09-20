//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');

module.exports = class DailyCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'daily',
            category: 'game',
            description: 'Gain some Gold',
            extensions: [ "profile" ]
        }
        super(comprops)
    }

    async action(client, message) {
        const loaded = this.inputData.loaded

        if (!(this.error)) {

            // Gold Reward: 30000 - 30000
            let [minReward, maxReward] = [30000, 30000]
            const randomNumber = Math.floor(Math.random() * (maxReward - minReward)) + minReward;

            await this.db_transform(loaded.id, "gold", randomNumber)

            this.props.description = `*<@${loaded.id}> has checked into the Lair for the Day and received...*`
            this.props.fields = [
                {
                    name: `${this.emojis.gold}${randomNumber.toLocaleString("en-AU")}`,
                    value: "Gold"
                }
            ]
        }
    }

    async test(client, message) {
        let dummy = null
        dummy = new DailyCommand()
        dummy.run(client, message, [], null, "")
    }
}
