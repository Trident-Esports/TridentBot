const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');
const dasu = require('dasu');

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
module.exports = class LeagueCommand extends VillainsCommand {
    constructor() {
        super(
            {
                name: "league",
                category: "information",
                description: "Call league listings"
            }
        )
    }

    async action(client, message, cmd) {
        let profile = {
            "team": {}
        }
        let handlerpath = "/league/"
        let profiles = {}
        let leagueGame = this.inputData.args[0] // valorant
        let leagueLevel = this.inputData.args[1] // challenger
        let teamID = this.inputData.args[2] // 262205

        profiles.league = [ handlerpath + '/' + leagueGame + '/' + leagueLevel + '/' + teamID + '.json' ]

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

                let props = []
                props.description = "Something got stuffed up here..."

                let title = (span.charAt(0).toUpperCase() + span.slice(1) + " Matches Schedule").trim()
                props.url = url.toString().includes('-') ? url.toString().substr(0,url.toString().indexOf('-')) : url
                let embed = new VillainsEmbed({...props})

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

                        let cachedEmoji = message.guild.emojis.cache.find(emoji => emoji.name === emojiName);
                        if (cachedEmoji?.available) {
                            foundEmoji = true
                            emoji += `${cachedEmoji}`;
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

                            let teamName = ""
                            let teamURL = "https://letsplay.live/"

                            if (json?.tournament_id) {
                                teamName += json.tournament_id + '/'
                                teamURL += "tournaments/" + json.tournament_id + '/'
                            }
                            if (json?.team_id) {
                                teamName += json.team_id
                                teamURL += "team/" + json.team_id
                            }
                            if (teamName != "") {
                                teamName = "LPL Team #" + teamName
                                props.description += ` *([${teamName}](${teamURL} '${teamURL}'))*`
                            }

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
                            value += ": <t:" + match.discord.timestamp + ":f>" + "\n";
                            if(match.discord.timestamp < (60 * 60 * 24 * 5)) {
                              value = ""
                            }
                            if(match.discord.url) {
                                value += `Match: [#${match.discord.id}](${match.discord.url} '${match.discord.url}')`
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

        if (pages.length) {
            await this.send(message, pages, [], "", true)
            this.null = true
        }
    }
}
