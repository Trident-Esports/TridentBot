const fs = require('fs')
const dasu = require('dasu')
const pagination = require('discord.js-pagination')
const { Message, MessageEmbed } = require('discord.js')
const { PromiseProvider } = require('mongoose')

let walk = function (dir) {
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

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))

let profile = {
    "title": "Matches",
    "aliases": [ "matches" ],
    "team": {}
}

module.exports = {
    name: profile.title + " Schedule",
    aliases: [ profile.aliases[0] ],
    description: profile.title + " Schedule",
    async execute(message, args, client, Discord) {
        let emojiIDs = {
            "745409743593406634": { // VillainsBot
                "apex":         "852638910751309865",
                "csgo":         "852609157508890675",
                "r6s":          "852609196973228043",
                "rocketleague": "852640960512917604",
                "val":          "852599150654783529"
            },
            "788021898146742292": { // Villains Esports
                "apex":         "852638839071572018",
                "csgo":         "852609659176484930",
                "r6s":          "852609684292108329",
                "rocketleague": "852641027345088533",
                "val":          "852596728732581899"
            }
        }

        let filepath = '/team/'
        let profiles = {}
        if(args) {
            if(args[0]) {
                if(!isNaN(args[0])) {
                    filepath += args[0]
                    profile.team.teamID = args[0]
                    if(args[1]) {
                        filepath += '-' + args[1] + ".json"
                        profiles[args[1]] = filepath
                    } else {
                        profiles = {
                            "complete": [ filepath + '-' + "complete" + ".json" ],
                            "incomplete": [ filepath + '-' + "incomplete" + ".json" ],
                            "next": [ filepath + '-' + "next" + ".json" ]
                        }
                    }
                } else {
                    if(["complete","completed","incomplete","next"].indexOf(args[0]) > -1) {
                        if(args[0] == "completed") {
                            args[0] = "complete"
                        }
                        if(!profiles[args[0]]) {
                            profiles[args[0]] = []
                        }
                        let locPath = "./rosters/dbs/teams"
                        let files = walk(locPath)
                        for(let file of files) {
                            let fData = JSON.parse(fs.readFileSync(file, "utf8"))
                            if(fData?.team?.teamID) {
                                profiles[args[0]].push(
                                    filepath + fData.team.teamID + '-' + args[0] + ".json"
                                )
                            }
                        }
                    }
                }
            }
        }

        let pages = []

        let stripe = profile["stripe"]

        switch (stripe) {
            default:
                stripe = "#B2EE17";
                break;
        }

        // Hack in my stuff to differentiate
        if (GLOBALS.DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }

        profile["stripe"] = stripe

        for(let [span,files] of Object.entries(profiles)) {
            for(let filepath of files) {
                let req = dasu.req

                let params = {
                    method: 'GET',
                    protocol: 'http',
                    hostname: 'villainsoce.mymm1.com',
                    port: 80,
                    path: filepath,
                }

                profile["url"] = "http://villainsoce.mymm1.com/team/" + profile.team.teamID

                if(span == "complete") {
                    span = "completed"
                }
                let title = span.substr(0,1).toUpperCase() + span.slice(1) + " " + profile.title + " Schedule"

                let newEmbed = new MessageEmbed()
                    .setColor(profile.stripe)
                    .setURL(profile.url)
                    .setThumbnail(defaults.thumbnail)
                    .setFooter(defaults.footer.msg, defaults.footer.image)
                    .setTimestamp();

                await req(params, function (err, res, data) {
                    let json = JSON.parse(data);
                    let game_details = json["events"];

                    let noMatches = Object.entries(game_details).length == 0;

                    let emoji = ""
                    let emojiName = json?.gameID?.detected ? json.gameID.detected : json.game;
                    if(emojiName == "val") {
                        emojiName = "valorant";
                    }

                    let foundEmoji = false;
                    if(message.guild.id in emojiIDs) {
                        if(json.gameID.detected in emojiIDs[message.guild.id]) {
                            emoji += "<:" + emojiName + ":" + emojiIDs[message.guild.id][json.gameID.detected] + ">";
                            foundEmoji = true;
                        }
                    }
                    if(!foundEmoji) {
                        emoji += '[' + json.gameID.detected + "] ";
                    }

                    if(!noMatches) {
                        newEmbed.setDescription("__***" + emoji + json.team + "***__")
                        title = span.substr(0,1).toUpperCase() + span.slice(1) + " " + profile.title + " Schedule"
                    }

                    if(json?.team_avatar && json.team_avatar !== "") {
                        newEmbed.setAuthor(title, defaults.thumbnail, profile.url);
                        newEmbed.setThumbnail(json.team_avatar);
                    } else {
                        newEmbed.setTitle("***" + title + "***");
                    }

                    for(let [timestamp,match] of Object.entries(game_details)) {
                        if(!match) {
                            noMatches = true;
                            continue;
                        }
                        let name = "";
                        let value = "";
                        if(match.discord.status == "complete") {
                            name += ((match.discord.winner == match.discord.team) ? "✅" : "❌");
                            value += "Started";
                        } else {
                            name += emoji;
                            value += "Starting";
                        }
                        name += match.discord.team + " 🆚 " + match.discord.opponent;
                        value += ": " + match.discord.starting + "\n";
                        if(match.discord.status == "incomplete" || (match.discord.scoreKeys.bySide.home != 0 || match.discord.scoreKeys.bySide.opponent != 0)) {
                            value += '[';
                            if(match.discord.status == "complete") {
                                value += "Final ";
                            }
                            value += "Score: " + match.discord.scoreKeys.bySide.home + " - " + match.discord.scoreKeys.bySide.opponent;
                            value += "](" + match.discord.url + ")";
                        }
                        newEmbed.addField(name,value)
                    }

                    if(noMatches) {
                        let teamName = "LPL Team #" + json["team_id"]
                        if(json["team"]) {
                            teamName = json["team"] + " (" + teamName + ")"
                        }
                        newEmbed.setDescription("__***" + emoji + json.team + "***__")

                        newEmbed.setDescription(
                            [
                                "__***" + emoji + json.team + "***__",
                                "No selected matches found for [" + teamName + "](" + json["team_url"] + ")."
                            ].join("\n")
                        )
                    }
                });
                pages.push(newEmbed)
            }
        }

        if(pages.length <= 1) {
            message.channel.send(pages[0])
        } else {
            const emoji = ["◀️", "▶️"]

            const timeout = '120000'

            pagination(message, pages, emoji, timeout)
        }
    }
}
