const fs = require('fs');
const dasu = require('dasu');
const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

function walk(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a JSON file */
            if (file.endsWith(".json")) {
                results.push(file);
            }
        }
    });
    return results;
}
module.exports = class MatchesCommand extends VillainsCommand {
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
                            if (args[2] && isNaN(args[2]) && (["all","complete","completed","incomplete","next"].indexOf(args[2].toLowerCase()) > -1)) {
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
                            if (args[1] && isNaN(args[1]) && (["all","complete","completed","incomplete","next"].indexOf(args[1].toLowerCase()) > -1)) {
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
                    if (["all","complete","completed","incomplete","next"].indexOf(args[0].toLowerCase()) > -1) {
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
                        let files = walk(locPath)
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
                let msg = `${message.author}, the correct usage is` + "\n"
                msg += "`.matches [all|incomplete|complete|next]`" + "\n"
                msg += "`.matches <LPL teamID> [all|incomplete|complete|next]`" + "\n"
                msg += "`.matches <LPL tourneyID> <LPL teamID> [all|incomplete|complete|next]`" + "\n"
                return message.channel.send(msg)
            }
        }

        let emojiIDs = JSON.parse(fs.readFileSync("dbs/emojis.json","utf8"))
        let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json","utf8"))

        let pages = []

        for (let [span, files] of Object.entries(profiles)) {
            for (let filepath of files) {
                let req = dasu.req

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

                let props = {
                    description: "Something got stuffed up here..."
                }
                let title = span.charAt(0).toUpperCase() + span.slice(1) + " Matches Schedule"
                props.url = url.toString().indexOf('-') > -1 ? url.toString().substr(0,url.toString().indexOf('-')) : url
                let embed = new VillainsEmbed(props)

                await req(params, function (err, res, data) {
                    try {
                        let json = JSON.parse(data)
                        let game_details = json["events"]

                        let noMatches = Object.entries(game_details).length == 0

                        let emoji = ""
                        let emojiKey = json?.gameID?.detected ? json.gameID.detected : json.game
                        let emojiName = emojiKey
                        if (emojiName == "val") {
                            emojiName = "valorant"
                        }

                        let foundEmoji = false
                        if (message.guild.id in emojiIDs) {
                            if (emojiKey in emojiIDs[message.guild.id]) {
                                emoji += "<:" + emojiName + ':' + emojiIDs[message.guild.id][emojiKey] + ">"
                                foundEmoji = true
                            }
                        }
                        if (!foundEmoji) {
                            if (emojiKey) {
                                emoji += '[' + emojiKey + "] "
                            }
                        }

                        if (!noMatches) {
                            props.description = "__***" + emoji + json.team + "***__"
                            if (json?.team_url) {
                                props.description = `[${props.description}](${json.team_url} '${json.team_url}')`
                            }

                            let teamName = "LPL Team #"
                            let teamURL = "https://letsplay.live/"

                            if (json?.tournament_id) {
                                teamName += json.tournament_id + '/'
                                teamURL += "tournaments/" + json.tournament_id + '/'
                            }
                            if (json?.team_id) {
                                teamName += json.team_id
                                teamURL += "team/" + json.team_id
                            }
                            props.description += ` *([${teamName}](${teamURL} '${teamURL}'))*`

                            embed.setDescription(props.description)
                        }

                        if (json?.team_avatar && json.team_avatar != "") {
                            embed.setAuthor(title, defaults.thumbnail, url)
                            embed.setThumbnail(json.team_avatar)
                        } else {
                            embed.setTitle(title)
                        }

                        for (let [timestamp, match] of Object.entries(game_details)) {
                            if (!match) {
                                noMatches = true
                                continue
                            }

                            let name = ""
                            let value = ""
                            if (match.discord.status == "complete") {
                                name += ((match.discord.winner == match.discord.team) ? "🟩" : "🟥");
                                value += "Started"
                            } else {
                                name += emoji
                                value += "Starting"
                            }
                            name += match.discord.team + " 🆚 " + match.discord.opponent
                            value += ": " + match.discord.starting + "\n";
                            if(match.discord.status == "incomplete" || (match.discord.scoreKeys.bySide.home != 0 || match.discord.scoreKeys.bySide.opponent != 0)) {
                                value += '[';
                                if(match.discord.status == "complete") {
                                    value += "Final ";
                                }
                                value += "Score: " + match.discord.scoreKeys.bySide.home + " - " + match.discord.scoreKeys.bySide.opponent;
                                value += `](${match.discord.url} '${match.discord.url}')`;
                            }
                            embed.addField(name, value)
                        }

                        if (noMatches) {
                            let teamName = "LPL Team #"
                            let teamURL = "https://letsplay.live/"

                            if (json?.tournament_id) {
                                teamName += json.tournament_id + '/'
                                teamURL += "tournaments/" + json.tournament_id + '/'
                            }
                            if (json?.team_id) {
                                teamName += json.team_id
                                teamURL += "team/" + json.team_id
                            }
                            if (json?.team) {
                                teamName = json.team + " (" + teamName + ')'
                            }

                            embed.setDescription(
                                [
                                    "__***" + emoji + teamName + "***__",
                                    `No selected matches found for [${teamName}](${teamURL} '${teamURL}').`
                                ].join("\n")
                            )
                        }
                    } catch(e) {
                        console.log(e)
                        // console.log(`Malformed JSON:${url}`)
                    }
                });
                pages.push(embed)
            }
        }
        super.send(message, pages, [], "", true)
    }
}
