//@ts-check

const BotActivityCommand = require('./botactivity')
const AdminCommand = require('../../classes/command/admincommand.class');

module.exports = class BotLiveCommand extends AdminCommand {
    constructor() {
        let comprops = {
            name: "botlive",
            category: "admin",
            description: "Make bot Go Live"
        }
        super(
            {...comprops}
        )
    }

    async run(client, message, args) {
        await this.processArgs(message, args, this.flags)
        let twitchID = this.inputData.args.shift()
        args = [
            "watching",
            `https://twitch.tv/${twitchID}`,
            this.inputData.args.join(" ")
        ]
        let botActivity = new BotActivityCommand()
        botActivity.run(client, message, args, null, "")
    }
}
