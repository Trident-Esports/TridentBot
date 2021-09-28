//@ts-check

const BotActivityCommand = require('./botactivity')
const AdminCommand = require('../../classes/command/admincommand.class');

module.exports = class BotLiveCommand extends AdminCommand {
    constructor(client) {
        let comprops = {
            name: "botlive",
            group: "mod",
            memberName: "botlive",
            description: "Make bot Go Live",
            guildOnly: true,
            ownerOnly: true,
            args: [
                {
                    key: "twitchID",
                    prompt: "Twitch Username",
                    type: "string"
                },
                {
                    key: "activityText",
                    prompt: "Activity Text",
                    type: "string"
                }
            ]
        }
        super(
            client,
            {...comprops},
            {}
        )
    }

    async run(message, args) {
        let twitchID = args.twitchID
        if(twitchID) {
            args = {
                activityName: "watching",
                streamURL: `https://twitch.tv/${twitchID}`,
                activityText: args.activityText
            }
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
          { twitchID: "villains_esc" },
          { twitchID: "tridentesports" },
          { twitchID: "villains_esc", activityText: "Rocket League" },
          { twitchID: "tridentesports", activityText: "VALORANT" }
        ]

        for(let added of varArgs) {
            let args = added
            dummy = new BotLiveCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
