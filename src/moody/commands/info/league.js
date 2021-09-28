const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');

const dasu = require('dasu');
const fs = require('fs');

module.exports = class LeagueCommand extends VillainsCommand {
    constructor(client) {
        super(
            client,
            {
                name: "league",
                group: "info",
                memberName: "league",
                description: "Call league listings",
                guildOnly: true,
                args: [
                    {
                        key: "leagueGame",
                        prompt: "Game",
                        type: "string"
                    },
                    {
                        key: "leagueLevel",
                        prompt: "League Level",
                        type: "string"
                    },
                    {
                        key: "Team ID",
                        prompt: "Team ID",
                        type: "string"
                    }
                ]
            }
        )
    }

    async action(message, args) {
        let profile = {
            "team": {}
        }
        let handlerpath = "/league"
        let profiles = {}
        let leagueGame  = args?.leagueGame  ? args.leagueGame   : "valorant" // valorant
        let leagueLevel = args?.leagueLevel ? args.leagueLevel  : "challenger" // challenger
        let teamID      = args?.teamID      ? args.teamID       : 262205 // 262205

        profiles.league = [ handlerpath + '/' + leagueGame + '/' + leagueLevel + '/' + teamID + '.json' ]

        let defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json","utf8"))

        let pages = []

        for (let [span, files] of Object.entries(profiles)) {
            for (let filepath of files) {
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

                let props = []
                props.description = ""

                let title = (span.charAt(0).toUpperCase() + span.slice(1) + " Matches Schedule").trim()
                props.url = url.toString().includes('-') ? url.toString().substr(0,url.toString().indexOf('-')) : url
                let embed = new VillainsEmbed({...props})

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
                            if (!match || !match.discord.team || !match.discord.opponent) {
                                noMatches = true
                                continue
                            } else {
                                noMatches = false
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
                              value = "???"
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
                        console.log(`Malformed JSON:${url}`)
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

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          { leagueGame: "valorant" },
          { leagueGame: "valorant", leagueLevel: "open" },
          { leagueGame: "valorant", leagueLevel: "evolution", teamID: "262656" }
        ]

        for(let added of varArgs) {
            let args = added
            dummy = new LeagueCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
