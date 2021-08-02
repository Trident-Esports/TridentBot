const fs = require('fs');
const dasu = require('dasu');
const TeamListingCommand = require('../../classes/teamlistingcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class MatchesCommand extends TeamListingCommand {
    constructor() {
        super({
            name: "matches",
            category: "information",
            description: "Call match listings"
        })
    }

    async run(client, message, args) {
        let profile = {
            "team": {}
        }
        let handlerpath = "/team/"
        let filepath = ""
        let profiles = {}
        let validSpan = null
        if (args) {                             // args passed
            if (args[0]) {                      // first arg passed
                if (!isNaN(args[0])) {          // first arg is a number (could be teamID or tourney ID)
                    filepath += args[0]
                    if (args[1]) {              // second arg passed
                        if (!isNaN(args[1])) {  // second arg is a number (first was tourneyID, this is teamID)
                            handlerpath = "/tourney/"
                            profile.team.tourneyID = args[0]
                            profile.team.teamID = args[1]
                            filepath += '/' + profile.team.teamID
                            // third arg passed
                            // third arg is not a number
                            // this is a valid span
                            if (args[2] && isNaN(args[2]) && (["all","complete","completed","incomplete","next"].includes(args[2].toLowerCase()))) {
                                let span = args[2].toLowerCase()
                                if (span == "completed") {
                                    span = "complete"
                                }
                                profiles[span] = [ handlerpath + filepath + '-' + span + ".json" ]
                                validSpan = true
                            } else { // invalid span
                                // return all spans
                                validSpan = false
                            }
                        } else {  // second arg is text (first was teamID, this is span)
                            profile.team.teamID = args[0]
                            if (args[1] && isNaN(args[1]) && (["all","complete","completed","incomplete","next"].includes(args[1].toLowerCase()))) {
                                // this is a valid span
                                let span = args[1].toLowerCase()
                                if (span == "completed") {
                                    span = "complete"
                                }
                                profiles[span] = [ handlerpath + filepath + '-' + span + ".json" ]
                                validSpan = true
                            } else { // invalid span
                                // return all spans
                                validSpan = false
                            }
                        }
                    } else {  // no second arg passed
                        // invalid span
                        // return all spans for teamID
                        validSpan = false
                    }
                    if (!validSpan) {
                        for (let span of [ "all", "complete", "incomplete", "next" ]) {
                            profiles[span] = [ handlerpath + filepath + '-' + span + ".json" ]
                        }
                    }
                } else {  // first arg is text
                    if (["all","complete","completed","incomplete","next"].includes(args[0].toLowerCase())) {
                        // this is a valid span
                        // return all rosters for span
                        let span = args[0].toLowerCase()
                        if (span == "completed") {
                            span = "complete"
                        }
                        if (!profiles[span]) {
                            profiles[span] = []
                        }
                        let locPath = "./rosters/dbs/teams"
                        let files = this.walk(locPath)
                        for (let file of files) {
                            let fData = JSON.parse(fs.readFileSync(file, "utf8"))
                            if (fData?.team?.teamID) {
                                let handlerpath = "/team/"
                                let filepath = fData.team.teamID
                                if (fData?.team?.tourneyID) {
                                    handlerpath = "/tourney/"
                                    filepath = fData.team.tourneyID + '/' + filepath
                                }
                                profiles[span].push(
                                    handlerpath + filepath + '-' + span + ".json"
                                )
                            }
                        }
                    }
                }
            } else {
                // something got stuffed up
                let msg = `${message.author}, the correct usage is:` + "\n"
                msg += "`" + this.prefix + "matches [all|incomplete|complete|next]`" + "\n"
                msg += "`" + this.prefix + "matches <LPL teamID> [all|incomplete|complete|next]`" + "\n"
                msg += "`" + this.prefix + "matches <LPL tourneyID> <LPL teamID> [all|incomplete|complete|next]`" + "\n"
                return message.channel.send(msg)
            }
        }

        let emojiIDs = JSON.parse(fs.readFileSync("dbs/emojis.json","utf8"))
        let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json","utf8"))

        let pages = []

        for (let [span, files] of Object.entries(profiles)) {
            for (let filepath of files) {
                let url = new URL("http://villainsoce.mymm1.com:80" + filepath)

                let params = {
                    method: 'GET',
                    protocol: url.protocol,
                    hostname: url.hostname,
                    port: url.port,
                    path: url.pathname
                }

                // if (DEV) {
                //     console.log(`Fetching:${url.toString()}`)
                // }

                let props = []
                props.description = "Something got stuffed up here..."
                props.title = { text: (span.charAt(0).toUpperCase() + span.slice(1) + " Matches Schedule").trim(), url: "" }
                props.url = url.toString().includes('-') ? url.toString().substr(0,url.toString().indexOf('-')) : url
                let embed = await this.makeReq(message.guild.emojis, {...props}, {...params})

                pages.push(embed)
            }
        }
        super.send(message, pages, [], "", true)
    }
}
