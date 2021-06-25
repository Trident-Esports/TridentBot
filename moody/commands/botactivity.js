const { BaseCommand } = require('a-djs-handler');
const SlimEmbed = require('../classes/vslimbed.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))

// ModCommand
module.exports = class BotActivityCommand extends BaseCommand {
    constructor() {
        super({
            name: "botactivity",
            aliases: [ "ba" ],
            category: "admin",
            description: "Bot Activity setter"
        })
    }

    async run(client, message, args) {
        let props = {
            title: {},
            description: ""
        }

        let APPROVED_ROLES = ROLES["admin"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
            props.title.text = "Error"
            props.description = "Sorry, only admins can run this command. 😔"
        } else {
            let activityIndexes = [
              "playing",    // 0
              "playing",    // 1
              "listening",  // 2
              "watching",   // 3
              "moo",        // 4
              "competing"   // 5
            ]

            let activity = 2

            if(DEV) {
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

            if(DEV) {
                console.log("New activity ID:  ",activity)
                console.log("New activity:     ",activityIndexes[activity])
                console.log()
            }

            if (activity !== "") {
                let msg = defaults.prefix + "help"
                client.user.setActivity(msg, {type:activity}) //you can change that to whatever you like
                props.description = 'Status changed succesfully: ' + activityIndexes[activity].slice(0,1).toUpperCase() + activityIndexes[activity].slice(1) + " **" + msg + "**"
            }
        }

        let embed = new SlimEmbed(props)
        await message.channel.send(embed)
    }
}
