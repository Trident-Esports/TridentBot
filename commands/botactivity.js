const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'bot activity',
    aliases: ['ba'],

    async execute(message, args, cmd, client) {

        APPROVED_USERIDS = [
          "263968998645956608", // Mike
          "532192409757679618", // Noongar
          "692180465242603591"  // PrimeWarGamer
        ]

        if (APPROVED_USERIDS.indexOf(message.member.id + "") == -1) return message.channel.send(
          `Sorry only ` +
          `**MikeTrethewey**,` +
          `**Noongar1800** or ` +
          `**PrimeWarGamer**` +
          ` can run this command 😔`
        );

        activityIndexes = [
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
            client.user.setActivity(defaults.prefix + "help", {type:activity}) //you can change that to whatever you like

            return message.channel.send('Status changed succesfully: ' + activityIndexes[activity])
        }
    }
}
