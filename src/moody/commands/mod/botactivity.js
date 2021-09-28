//@ts-check

const AdminCommand = require('../../classes/command/admincommand.class');

// AdminCommand
module.exports = class BotActivityCommand extends AdminCommand {
    constructor(client, props = {}) {
        let comprops = {
            name: "botactivity",
            aliases: [ "ba" ],
            group: "admin",
            memberName: "botactivity",
            description: "Bot Activity setter",
            guildOnly: true,
            ownerOnly: true,
            args: [
                {
                    key: "activityName",
                    prompt: "Activity Name",
                    type: "string"
                },
                {
                    key: "activityText",
                    prompt: "Activity Text",
                    type: "string"
                },
                {
                    key: "streamURL",
                    prompt: "Stream URL",
                    type: "string"
                }
            ]
        }
        props = {
            ...props,
            flags: {
                user: "unapplicable"
            },
            caption: {
                text: "Bot Activity"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(message, args) {
        // Default supported activities
        let activityNames = [
            "playing",
            "streaming",
            "listening",
            "watching",
            "moo",
            "competing"
        ]

        // Default to listening
        let defaultActivity = "listening"
        let activity = defaultActivity
        let msg = this.prefix + "help"
        let url = ""

        let padding = 20

        if(this.DEV) {
            console.log("Default activity:".padEnd(padding),activity)
            console.log("Sent activity:".padEnd(padding),'[' + this.inputData.args[0] + ']')
        }
        if(args.streamURL) {
            try {
                let tryURL = args.streamURL.replace("<","").replace(">","")
                if(new URL(tryURL)) {
                    url = tryURL
                    if(args.activityText)  {
                        msg = args.activityText
                    }
                    if(this.DEV) {
                        console.log("Sent URL:".padEnd(padding),url)
                    }
                }
            } catch {
                // do nothing
            }
        }
        if(args.activityText) {
            msg = args.activityText
        }
        if(this.DEV) {
            console.log("Sent msg:".padEnd(padding),msg)
        }

        if(args.activityName) {
            // If arg[0] sent, if it's a number, set it to one of the defined ones
            if(!(isNaN(args.activityName.trim()))) {
                let activityID = args.activityName.trim()
                if(activityID < activityNames.length) {
                    activity = activityNames[activityID]
                }
            } else if(args.activityName.trim() != "") {
                // If arg[0] sent, if it's not a number, check to see if it's in the list
                let activityName = args.activityName.trim()
                if(!(activityNames.includes(activityName.toLowerCase()))) {
                    // If it's not in the list, set to default
                    activity = defaultActivity
                } else {
                    activity = activityName
                }
            }
            if(activity.toLowerCase() == "moo") {
                activity = defaultActivity
            }
        }

        if(url != "") {
            activity = "streaming"
        } else if(activity.toLowerCase() == "streaming" && url == "") {
            activity = defaultActivity
        }

        if(this.DEV) {
            console.log("New activity:".padEnd(padding),activity.toUpperCase())
        }

        if (activity !== "") {
            let args = {
                name: msg,
                type: activity.toUpperCase()
            }
            if(url != "") {
                args.url = url
            }
            message.client.user.setActivity(args) //you can change that to whatever you like
            let desc = "Status changed succesfully: "
            desc += activity.charAt(0).toUpperCase() + activity.slice(1)
            if(activity == "listening") {
                desc += " to"
            } else if(activity == "competing") {
                desc += " in"
            }
            if(this.DEV) {
                console.log("New Message:".padEnd(padding),desc.substr(desc.indexOf(':') + 1).trim() + " " + args.name)
                console.log()
            }
            desc += " "
            desc += "**"
            desc += args?.url ? `[${args.name}](${args.url} '${args.url}')` : args.name
            desc += "**"
            this.props.description = desc
        }
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          { activityName: "0" },
          { activityName: "2" },
          { activityName: "playing" },
          { activityName: "listening" },
          { activityName: "0", activityText: "VALORANT" },
          { activityName: "5", activityText: "eSports" },
          { activityName: "playing", activityText: "VALORANT" },
          { activityName: "competing", activityText: "eSports" },
          { activityName: "watching", streamURL: "https://twitch.tv/tridentesports", activityText: "VALORANT" },
          { activityName: "streaming", streamURL: "https://twitch.tv/tridentesports", activityText: "VALORANT" },
          { activityName: "" }
        ]

        for(let added of varArgs) {
            let args = added
            dummy = new BotActivityCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
