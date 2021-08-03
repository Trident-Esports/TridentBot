/*

Command for Team/Match lists

BaseCommand
 VillainsCommand
  TeamListingCommand

*/
const VillainsCommand = require('./vcommand.class');
const VillainsEmbed = require('./vembed.class');
const dasu = require('dasu');
const fs = require('fs');

module.exports = class TeamListingCommand extends VillainsCommand {
    constructor(...args) {
        // Create a parent object
        super(...args)
    }

    async walk(dir, filext = ".json") {
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
                if (file.endsWith(filext)) {
                    results.push(file);
                }
            }
        });
        return results;
    }

    async makeReq(emojis, props, params) {
        let req = dasu.req
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

                let cachedEmoji = emojis.cache.find(emoji => emoji.name === emojiName);
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
                    props.description = ""
                    if(json?.league_name) {
                        let txt = "__***" + emoji + json.league_name + "***__"
                        if(json?.league_url) {
                            props.description += `[${txt}](${json.league_url} '${json.league_url}')`
                        } else {
                            props.description += txt
                        }
                        props.description += "\n"
                    }
                    if(json?.team) {
                        let txt = "__***" + emoji + json.team + "***__"
                        if(json?.team_url) {
                            props.description += `[${txt}](${json.team_url} '${json.team_url}')`
                        } else {
                            props.description += txt
                        }
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
                    embed.setAuthor(props.title.text, "", props.title.url)
                    embed.setThumbnail(json.team_avatar)
                } else {
                    embed.setTitle(props.title.text, props.title.url)
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
                    if (
                        match?.discord?.status &&
                        match?.discord?.scoreKeys?.bySide &&
                        (
                            match.discord.status == "incomplete" ||
                            (
                                match.discord.scoreKeys.bySide.home != 0 ||
                                match.discord.scoreKeys.bySide.opponent != 0
                            )
                        )
                    ) {
                        value += '[';
                        if (match.discord.status == "complete") {
                            value += "Final ";
                        }
                        value += "Score: " + match.discord.scoreKeys.bySide.home + " - " + match.discord.scoreKeys.bySide.opponent;
                        value += `](${match.discord.url} '${match.discord.url}')` + "\n";
                    }
                    if (match?.discord?.maps) {
                        for (let map of match.discord.maps) {
                            value += ((map.winner == match.discord.team) ? "🟩" : "🟥");
                            if (map?.score) {
                                value += `${map.name}: ${map.score.join(" - ")}` + "\n"
                            }
                        }
                    }
                    if (match?.discord?.id && match?.discord?.url) {
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
        return embed
    }
}
