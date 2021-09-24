//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const dasu = require('dasu');
const fs = require('fs');

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
                            if (args[2] && isNaN(args[2]) && (["all","complete","completed","incomplete","next"].includes(args[2].toLowerCase()))) {
                                let span = args[2].toLowerCase()
                                if (span == "completed") {
                                    span = "complete"
                                }
                                profiles[span] = [
                                    {
                                        url: handlerpath + filepath + '-' + span + ".json",
                                        lpl: { teamID: profile.team.teamID }
                                    }
                                ]
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
                                profiles[span] = [
                                    {
                                        url: handlerpath + filepath + '-' + span + ".json",
                                        lpl: { teamID: profile.team.teamID }
                                    }
                                ]
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
                            profiles[span] = [
                                {
                                    url: handlerpath + filepath + '-' + span + ".json",
                                    lpl: { teamID: args[0] }
                                }
                            ]
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
                        let guilds = JSON.parse(fs.readFileSync("./src/dbs/guilds.json","utf8"))
                        let org = message.guild.id in Object.keys(guilds) ? guilds[message.guild.id] : "tdnt"
                        let locPath = "./src/rosters/dbs/" + org + "/teams"
                        let files = walk(locPath)
                        for (let file of files) {
                            let fData = JSON.parse(fs.readFileSync(file, "utf8"))
                            let thisFile = {}
                            if (fData?.team?.lpl?.teamID) {
                                let handlerpath = "/team/"
                                let filepath = fData.team.lpl.teamID
                                if (fData?.team?.lpl?.tourneyID) {
                                    handlerpath = "/tourney/"
                                    filepath = fData.team.lpl.tourneyID + '/' + filepath
                                }
                                thisFile["url"] = handlerpath + filepath + '-' + span + ".json"
                                thisFile["lpl"] = { teamID: fData.team.lpl.teamID }
                            }
                            if (fData?.team?.esea?.teamID) {
                                thisFile["esea"] = { teamID: fData.team.esea.teamID }
                            }
                            if (Object.keys(thisFile).length > 0) {
                                profiles[span].push(thisFile)
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
                return message.channel.send({ content: msg })
            }
        }

        let defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))

        let pages = []

        for (let [span, files] of Object.entries(profiles)) {
            for (let fileData of files) {
                let filepath = fileData.url
                let req = dasu.req

                let url = new URL("http://tridentoce.mymm1.com:80" + filepath)

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
                    description: ""
                }
                let title = span.charAt(0).toUpperCase() + span.slice(1) + " Matches Schedule"
                props.url = url.toString().includes('-') ? url.toString().substr(0,url.toString().indexOf('-')) : url
                let embed = new VillainsEmbed(props)

                await req(params, async function (err, res, data) {
                    try {
                        let json = JSON.parse(data)
                        let game_details = json["events"]

                        let noMatches = Object.entries(game_details).length == 0

                        let emojiKey = json?.gameID?.detected ? json.gameID.detected : json.game
                        //FIXME: BAD BAD HACK!
                        let emoji = await new VillainsCommand({name:""}).getEmoji(emojiKey, message.guild.emojis)

                        if (!noMatches) {
                            props.description = ""
                            if (json?.league_name) {
                                props.description = "***" + json.league_name + "***" + "\n"
                            }
                            let header = "__***" + emoji + json.team + "***__"
                            if (json?.team_url) {
                                header = `[${header}](${json.team_url} '${json.team_url}')`
                            }
                            props.description += header

                            let lplName = "LPL Team #"
                            let lplURL = "https://letsplay.live/"

                            if (json?.tournament_id) {
                                lplName += json.tournament_id + '/'
                                lplURL += "tournaments/" + json.tournament_id + '/'
                            }
                            if (json?.team_id) {
                                lplName += json.team_id
                                lplURL += "team/" + json.team_id
                            }
                            props.description += ` *([${lplName}](${lplURL} '${lplURL}'))*`

                            if (fileData?.esea?.teamID) {
                                let eseaName = "ESEA Team #"
                                let eseaURL = "https://play.esea.net/"
                                eseaName += fileData.esea.teamID
                                eseaURL += "teams/" + fileData.esea.teamID
                                props.description += "\n"
                                let emojiKey = "esea"
                                let emoji = await new VillainsCommand({name:""}).getEmoji(emojiKey, message.guild.emojis)
                                props.description += ` *(${emoji}[${eseaName}](${eseaURL} '${eseaURL}'))*`
                            }

                            props.description += "\n"
                            embed.setDescription(props.description)
                        }

                        if (json?.team_avatar && json.team_avatar != "") {
                            embed.setAuthor(title, defaults.thumbnail, url.toString())
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
                            value += ": <t:" + match.discord.timestamp + ":f>" + "\n";
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
                            let lplName = "LPL Team #"
                            let lplURL = "https://letsplay.live/"

                            if (json?.tournament_id) {
                                lplName += json.tournament_id + '/'
                                lplURL += "tournaments/" + json.tournament_id + '/'
                            }
                            if (json?.team_id) {
                                lplName += json.team_id
                                lplURL += "team/" + json.team_id
                            }
                            if (json?.team) {
                                lplName = json.team + " (" + lplName + ')'
                            }

                            props.description = "__***" + emoji + lplName + "***__"

                            if (fileData?.esea?.teamID) {
                                let eseaName = "ESEA Team #"
                                let eseaURL = "https://play.esea.net/"
                                eseaName += fileData.esea.teamID
                                eseaURL += "teams/" + fileData.esea.teamID
                                let emojiKey = "esea"
                                let emoji = await new VillainsCommand({name:""}).getEmoji(emojiKey, message.guild.emojis)
                                props.description += ` *(${emoji}[${eseaName}](${eseaURL} '${eseaURL}'))*`
                            }

                            props.description += "\n"
                            props.description += `No selected matches found for [${lplName}](${lplURL} '${lplURL}')` + "\n"

                            embed.setDescription(props.description)
                        }
                    } catch(e) {
                        if (data.substring(0,1) === '<') {
                            console.log(`Matches: Malformed JSON: ${url}`)
                        } else {
                            console.log(e)
                        }
                    }
                });
                pages.push(embed)
            }
        }
        super.send(message, pages, [], 0, true)
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "262890",
          "262377",
          "261418"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new MatchesCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args)
        }
    }
}
