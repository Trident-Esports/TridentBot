const AdminCommand = require('../classes/admincommand.class');

// AdminCommand
module.exports = class BotActivityCommand extends AdminCommand {
    constructor() {
        let comprops = {
            name: "botactivity",
            aliases: [ "ba" ],
            category: "admin",
            description: "Bot Activity setter"
        }
        let props = {
            title: {
                text: "Bot Activity"
            },
            full: true
        }
        super(comprops, props)
    }

    async action(client, message, args) {
        let activityIndexes = [
          "playing",    // 0
          "playing",    // 1
          "listening",  // 2
          "watching",   // 3
          "moo",        // 4
          "competing"   // 5
        ]

        let activity = 2

        if(this.DEV) {
            console.log("Default activity: ",activity)
            console.log("Sent activity:    ",args[0])
        }

        if(isNaN(args[0])) {
            if(activityIndexes.indexOf(args[0]) > -1) {
                activity = activityIndexes.indexOf(args[0])
            }
        } else {
            if((parseInt(args[0]) < 0) || (parseInt(args[0]) >= activityIndexes.length)) {
                args[0] = activity
            }
            activity = parseInt(args[0])
            if(activityIndexes[activity] == "moo") {
                activity = 2
            }
        }

        if(this.DEV) {
            console.log("New activity ID:  ",activity)
            console.log("New activity:     ",activityIndexes[activity])
            console.log()
        }

        if (activity !== "") {
            let msg = this.DEFAULTS.prefix + "help"
            client.user.setActivity(msg, {type:activity}) //you can change that to whatever you like
            this.props.description = 'Status changed succesfully: ' + activityIndexes[activity].slice(0,1).toUpperCase() + activityIndexes[activity].slice(1) + " **" + msg + "**"
        }
    }
}
