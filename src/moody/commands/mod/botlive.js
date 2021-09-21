//@ts-check

const BotActivityCommand = require('./botactivity')
const AdminCommand = require('../../classes/command/admincommand.class');

module.exports = class BotLiveCommand extends AdminCommand {
    constructor(client) {
        let comprops = {
            name: "botlive",
            group: "admin",
            memberName: "botlive",
            description: "Make bot Go Live",
            guildOnly: true,
            ownerOnly: true
        }
        super(
            client,
            {...comprops}
        )
    }

    async run(message, args) {
        await this.processArgs(message, args, this.flags)
        let twitchID = this.inputData.args.shift()
        if(twitchID) {
            args = [
                "watching",
                `https://twitch.tv/${twitchID}`,
                this.inputData.args.join(" ")
            ]
            let botActivity = new BotActivityCommand(message.client)
            botActivity.run(message, args)
        } else {
            this.error = true
            this.props.description = "No Twitch ID sent!"
            return
        }
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "villains_esc",
          "tridentesports",
          "villains_esc Rocket League",
          "tridentesports VALORANT"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new BotLiveCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
