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
let DEV = GLOBALS.DEV

let profile = {
    "title": "Matches",
    "aliases": [ "matches" ],
    "team": {}
}

module.exports = {
    name: profile.aliases[0],
    aliases: [ profile.aliases[0] ],
    description: profile.title + " Schedule",
    async execute(message, args, client, Discord) {
        //FIXME: EmojiIDs
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

        let handlerpath = '/team/'
        let filepath = ""
        let profiles = {}

        if(args) {                            // args passed
            if(args[0]) {                     // first arg passed
                if(!isNaN(args[0])) {         // first arg is a number (could be team ID or tourney ID)
                    filepath += args[0]
                    if(args[1]) {             // second arg passed
                        if(!isNaN(args[1])) { // second arg is a number (first was tourney ID, this is team ID)
                            handlerpath = '/tourney/'
                            profile.team.tourneyID = args[0]
                            profile.team.teamID = args[1]
                            filepath += '/' + profile.team.teamID
                            if(args[2] && (["complete","completed","incomplete","next"].indexOf(args[2]) > -1)) {
                                let span = args[2]
                                profiles = {
                                    span: [ handlerpath + filepath + '-' + span + ".json" ]
                                }
                            } else {
                                profiles = {
                                    "complete":   [ handlerpath + filepath + '-' + "complete"   + ".json" ],
                                    "incomplete": [ handlerpath + filepath + '-' + "incomplete" + ".json" ],
                                    "next":       [ handlerpath + filepath + '-' + "next"       + ".json" ]
                                }
                            }
                        } else {              // second arg is text (first was team ID, this is matches span)
                            profile.team.teamID = args[0]
                            profile.span = args[1]
                            filepath += '-' + profile.span + ".json"
                            profiles[profile.span] = handlerpath + filepath
                        }
                    } else {                  // no second arg passed, process for all matches spans
                        profiles = {
                            "complete":   [ handlerpath + filepath + '-' + "complete"   + ".json" ],
                            "incomplete": [ handlerpath + filepath + '-' + "incomplete" + ".json" ],
                            "next":       [ handlerpath + filepath + '-' + "next"       + ".json" ]
                        }
                    }
                } else {                      // first arg is text (this is matches span), process for all available teams
                    profile.span = args[0]
                    if(profile.span == "completed") {
                        profile.span = "complete"
                    }
                    if(["complete","incomplete","next"].indexOf(profile.span) > -1) {
                        if(!profiles[profile.span]) {
                            profiles[profile.span] = []
                        }
                        let locPath = "./rosters/dbs/teams"
                        let files = walk(locPath)
                        for(let file of files) {
                            let fData = JSON.parse(fs.readFileSync(file, "utf8"))
                            if(fData?.team?.teamID) {
                                let handlerpath = "/team/"
                                let filepath = fData.team.teamID
                                if(fData?.team?.tourneyID) {
                                    handlerpath = "/tourney/"
                                    filepath = fData.team.tourneyID + '/' + filepath
                                }
                                profiles[profile.span].push(
                                    handlerpath + filepath + '-' + profile.span + ".json"
                                )
                            }
                        }
                    }
                }
            } else {
                let msg = `${message.author}, the correct usage is` + "\n"
                msg += "`.matches [incomplete|complete|next]`" + "\n"
                msg += "`.matches <LPL teamID> [incomplete|complete|next]`" + "\n"
                msg += "`.matches <LPL tourneyID> <LPL teamID> [incomplete|complete|next]`" + "\n"
                return message.channel.send(msg)
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

                let url = new URL("http://villainsoce.mymm1.com:80" + filepath)

                let params = {
                    method: 'GET',
                    protocol: url.protocol,
                    hostname: url.hostname,
                    port: url.port,
                    path: url.pathname,
                }

                if(DEV) {
                    console.log("Fetching: " + url)
                }

                profile["url"] = "http://villainsoce.mymm1.com/team/" + profile.team.teamID

                if(span == "complete") {
                    span = "completed"
                }
                let title = span.substr(0,1).toUpperCase() + span.slice(1) + " " + profile.title + " Schedule"


                let newEmbed = new MessageEmbed()
                    .setColor(profile.stripe)
                    .setURL(profile.url)
                    .setDescription("Something got stuffed up here...")
                    .setThumbnail(defaults.thumbnail)
                    .setFooter(defaults.footer.msg, defaults.footer.image)
                    .setTimestamp();

                await req(params, function (err, res, data) {
                    try {
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
                            if(json?.gameID?.detected in emojiIDs[message.guild.id]) {
                                emoji += "<:" + emojiName + ":" + emojiIDs[message.guild.id][json.gameID.detected] + ">";
                                foundEmoji = true;
                            }
                        }
                        if(!foundEmoji) {
                            if(json?.gameID?.detected) {
                                emoji += '[' + json.gameID.detected + "] ";
                            }
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
                            let teamName = "LPL Team #"
                            let teamURL = "https://letsplay.live/"
                            if(json?.tournament_id) {
                                teamName += json.tournament_id + '/'
                                teamURL += "tournaments/" + json.tournament_id + '/'
                            }
                            if(json?.team_id) {
                                teamName += json.team_id
                                teamURL += "team/" + json.team_id
                            }
                            let title = emoji
                            if(json?.team) {
                                teamName = json.team + " (" + teamName + ")"
                            }

                            newEmbed.setDescription(
                                [
                                    "__***" + emoji + teamName + "***__",
                                    "No selected matches found for [" + teamName + "](" + teamURL + ")."
                                ].join("\n")
                            )
                        }
                    } catch(e) {
                        console.log("Malformed JSON: " + url)
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
