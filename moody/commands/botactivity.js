const AdminCommand = require('../classes/admincommand.class');

// AdminCommand
module.exports = class BotActivityCommand extends AdminCommand {
    constructor() {
        let comprops = {
            name: "botactivity",
            aliases: [ "ba" ],
            category: "admin",
            description: "Bot Activity setter",
            flags: {
                user: "unapplicable"
            }
        }
        let props = {
            caption: {
                text: "Bot Activity"
            }
        }
        super(comprops, props)
    }

    async action(client, message) {
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
            console.log("Sent activity:    [",this.inputData.args[0] + ']')
        }

        if(this.inputData.args[0].trim() == "") {
            this.inputData.args[0] = activity
        }

        if(isNaN(this.inputData.args[0])) {
            if(activityIndexes.indexOf(this.inputData.args[0].toLowerCase()) > -1) {
                activity = activityIndexes.indexOf(this.inputData.args[0].toLowerCase())
            }
        } else {
            if((parseInt(this.inputData.args[0]) < 0) || (parseInt(this.inputData.args[0]) >= activityIndexes.length)) {
                this.inputData.args[0] = activity
            }
            activity = parseInt(this.inputData.args[0])
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
            let msg = this.prefix + "help"
            client.user.setActivity(msg, {type:activity}) //you can change that to whatever you like
            this.props.description = 'Status changed succesfully: ' + activityIndexes[activity].slice(0,1).toUpperCase() + activityIndexes[activity].slice(1) + " **" + msg + "**"
        }
    }
}
