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
            description: "Bot Activity setter"
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

    async action(message) {
        console.log(client)
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
        if(this.inputData.args.length > 1) {
            try {
                let tryURL = this.inputData.args[1].replace("<","").replace(">","")
                if(new URL(tryURL)) {
                    url = tryURL
                    if(this.inputData.args.length > 2)  {
                        msg = this.inputData.args.slice(2).join(" ")
                    }
                    if(this.DEV) {
                        console.log("Sent URL:".padEnd(padding),url)
                    }
                }
            } catch {
                msg = this.inputData.args.slice(1).join(" ")
            }
        }
        if(this.DEV) {
            console.log("Sent msg:".padEnd(padding),msg)
        }

        if(this.inputData.args && this.inputData.args[0]) {
            // If arg[0] sent, if it's a number, set it to one of the defined ones
            if(!(isNaN(this.inputData.args[0].trim()))) {
                let activityID = this.inputData.args[0].trim()
                if(activityID < activityNames.length) {
                    activity = activityNames[activityID]
                }
            } else if(this.inputData.args[0].trim() != "") {
                // If arg[0] sent, if it's not a number, check to see if it's in the list
                let activityName = this.inputData.args[0].trim()
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
            client.user.setActivity(args) //you can change that to whatever you like
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

    async test(message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "0",
          "2",
          "playing",
          "listening",
          "0 VALORANT",
          "5 eSports",
          "playing VALORANT",
          "competing eSports",
          "watching https://twitch.tv/tridentesports VALORANT",
          "streaming https://twitch.tv/tridentesports VALORANT",
          ""
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new BotActivityCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
