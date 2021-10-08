//@ts-check

const BotActivityCommand = require('./botactivity')
const AdminCommand = require('../../classes/command/admincommand.class');

module.exports = class BotLiveCommand extends AdminCommand {
    constructor(context) {
        let comprops = {
            name: "botlive",
            category: "admin",
            description: "Make bot Go Live"
        }
        let props = {}
        super(
            context,
            {...comprops},
            {...props}
        )
    }

    async action(message, args) {
        this.null = true
        let twitchID = this.inputData.args.shift()
        args = [
            "watching",
            `https://twitch.tv/${twitchID}`,
            this.inputData.args.join(" ")
        ]
        let botActivity = new BotActivityCommand(message.client)
        botActivity.run(message, args, "")
    }

    async test(message, cmd) {
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
            dummy = new BotLiveCommand(message.client)
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args, cmd)
        }
    }
}
