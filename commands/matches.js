const fs = require('fs')
const dasu = require('dasu')
const { Message, MessageEmbed } = require('discord.js')

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

        let req = dasu.req

        let filepath = '/team/'
        if(args) {
            if(args[0]) {
                filepath += args[0]
                profile.team.teamID = args[0]
            }
            if(args[1]) {
                filepath += '-' + args[1]
            }
        }
        filepath += '.json'

        let params = {
            method: 'GET',
            protocol: 'http',
            hostname: 'villainsoce.mymm1.com',
            port: 80,
            path: filepath,
        }

        req(params, function (err, res, data) {
            let json = JSON.parse(data);
            let game_details = json["events"];

            let noMatches = Object.entries(game_details).length == 0;

            let emoji = ""
            let emojiName = json?.gameID?.detected ? json.gameID.detected : json.game;
            if(emojiName == "val") {
                emojiName = "valorant";
            }

            if(!noMatches) {
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
            }

            let newEmbed = new MessageEmbed()
                .setColor(profile.stripe)
                .setTitle("***" + emoji + profile.title + " Schedule***")
                .setURL("http://villainsoce.mymm1.com/team/" + profile.team.teamID)
                // .setDescription()
                .setThumbnail(defaults.thumbnail)
                .setFooter(defaults.footer.msg, defaults.footer.image)
                .setTimestamp();

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
                name += match.discord.team + " <:vs:839624205766230026> " + match.discord.opponent;
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
                newEmbed.setDescription(
                    "No selected matches found for [" + teamName + "](" + json["team_url"] + ")."
                )
            }
            
            message.channel.send(newEmbed);
        });
    }
}
