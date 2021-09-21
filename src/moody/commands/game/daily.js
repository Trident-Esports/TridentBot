//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');

module.exports = class DailyCommand extends GameCommand {
    constructor(client) {
        let comprops = {
            name: 'daily',
            group: 'game',
            memberName: 'daily',
            description: 'Gain some Gold',
            guildOnly: true
        }
        super(
            client,
            {...comprops},
            {
                extensions: [ "profile" ]
            }
        )
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
        dummy = new DailyCommand(client)
        dummy.run(message, [])
    }
}
