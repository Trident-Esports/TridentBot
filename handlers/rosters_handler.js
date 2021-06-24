const fs = require('fs')
const path = require("path")
const dasu = require('dasu')

const Discord = require('discord.js')
const {
    MessageEmbed
} = require("discord.js");
const { MessageButton } = require('discord-buttons');
const { clear } = require('console');

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
let socials = JSON.parse(fs.readFileSync("rosters/dbs/socials/users.json", "utf8"))

module.exports = (client, Discord) => {
    let dir = "./rosters"
    const rosters_profiles = walk(dir)

    let roster_aliases = {}

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

    let aliasesWithSchedules = []

    for (const file of rosters_profiles) {
        if(file.indexOf("socials") > -1) {
            continue;
        }
        let profile = JSON.parse(fs.readFileSync(file, "utf8"))
        if(file.indexOf("teams") != -1) {
            let parts = file.split("/")
            let gameID = parts[parts.length - 2]
            if(Object.keys(roster_aliases).indexOf(gameID) == -1) {
                roster_aliases[gameID] = {}
            }
            roster_aliases[gameID][profile.aliases[0]] = {
                name: profile.title,
                schedule: ("team" in profile)
            }
            if("team" in profile) {
                aliasesWithSchedules.push(profile.aliases[0] + 's')
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

        let roster = {
            name: profile.aliases[0],
            aliases: profile.aliases,
            permissions: [],
            description: profile.title,
            async execute(message, client, Discord) {

                var newEmbed = new MessageEmbed()
                    .setColor(profile.stripe)
                    .setTitle("***" + profile.title + "***")
                    .setURL(profile.url)
                    // .setDescription()
                    .setThumbnail(defaults.thumbnail)
                    .setFooter(defaults.footer.msg, defaults.footer.image)
                    .setTimestamp();
                
                // const btnNext = new MessageButton()
                //     .setStyle('green')
                //     .setLabel('Next Match')
                //     .setID('NextM')

                for (let [groupName, groupAttrs] of Object.entries(profile.members)) {
                    let userSTR = "";
                    if (groupAttrs.users.length == 0) {
                        groupAttrs.users.push("TBA")
                    }
                    for (let user of groupAttrs.users) {
                        let social = socials[user];
                        if (!social) {
                            // console.log(user);
                        }
                        let name = user.charAt(0).toUpperCase() + user.slice(1);
                        let userURL = "";
                        if (social) {
                            if (social.stylized !== undefined) {
                                name = social.stylized;
                            }
                            if (social.twitter !== undefined) {
                                userURL = "https://twitter.com/" + social.twitter;
                            } else if (social.twitch !== undefined) {
                                userURL = "https://twitch.tv/" + social.twitch;
                            } else if (social.instagram !== undefined) {
                                userURL = "https://instagram.com/" + social.instagram;
                            }
                        }
                        if (userURL != "") {
                            userSTR += "[";
                        }
                        userSTR += name;
                        if (userURL != "") {
                            userSTR += "](" + userURL + ")";
                        }
                        userSTR += "\n";
                    }
                    if(userSTR != "") {
                        newEmbed.addField(groupAttrs.title, userSTR, false);
                    } else {
                        console.log(groupAttrs.title + " has empty value!")
                    }
                }
                message.channel.send(newEmbed);
            }
        }
        let schedule = null
        if(file.indexOf("teams") !== -1) {
            schedule = {
                name: profile.title + " Schedule",
                aliases: [profile.aliases[0] + 's'],
                description: profile.title + " Schedule",
                async execute(message, args, client, Discord) {

                    if(profile.team) {
                        let req = dasu.req

                        let filepath = '/team/'
                        if(profile?.team?.tourneyID) {
                            filepath = "/tourney/"
                            filepath += profile.team.tourneyID + '/'
                        }
                        filepath += profile.team.teamID
                        if(args) {
                            if(args[0]) {
                                filepath += '-' + args[0]
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

                            let emoji = ""
                            let emojiName = "";
                            let detectedGame = "";
                            if(json?.gameID?.detected) {
                                detectedGame = json.gameID.detected
                                emojiName = detectedGame
                            }
                            if(emojiName == "val") {
                                emojiName = "valorant";
                            }
                            let foundEmoji = false;
                            if(message.guild.id in emojiIDs) {
                                if(detectedGame != "") {
                                    if(detectedGame in emojiIDs[message.guild.id]) {
                                        emoji += "<:" + emojiName + ":" + emojiIDs[message.guild.id][detectedGame] + ">";
                                        foundEmoji = true;
                                    }
                                }
                            }
                            if(!foundEmoji && detectedGame != "") {
                                emoji += '[' + detectedGame + "] ";
                            }

                            let newEmbed = new MessageEmbed()
                                .setColor(profile.stripe)
                                .setTitle("***" + emoji + profile.title + " Schedule***")
                                .setURL("http://villainsoce.mymm1.com/team/" + profile.team.teamID)
                                // .setDescription()
                                .setThumbnail(defaults.thumbnail)
                                .setFooter(defaults.footer.msg, defaults.footer.image)
                                .setTimestamp();

                            let noMatches = Object.entries(game_details).length == 0;
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

                            message.channel.send(newEmbed);
                        });
                    }
                }
            }
        }
        if (roster.name) {
            client.commands.set(roster.aliases[0], roster);
            if(schedule !== null) {
                let newCommand = {
                    name: roster.aliases[0] + 's',
                    aliases: [ roster.aliases[0] + 's' ],
                    description: roster.description,
                    async execute(message, args, Discord) {
                        command = "matches"
                        args = profile?.team?.teamID ? profile.team.teamID : ""
                        client.commands.get(command).execute(message, args)
                        //FIXME: Cannot send an empty message
                    }
                }
                client.commands.set(roster.aliases[0] + 's', newCommand);
            }
        }
    }

    let allMatches = {
        name: "games",
        aliases: [ "games" ],
        description: "All Matches with optional span lengths",
        async execute(message, args) {
            if(args) {
                if(["complete","incomplete","next"].indexOf(args[0]) !== -1) {
                    for(let scheduler of aliasesWithSchedules) {
                        message.channel.send('.' + scheduler + " " + args[0])
                    }
                }
            }
        }
    }
    client.commands.set(allMatches.name, allMatches);

    if(roster_aliases) {
        let profile = {
          title: "Team Lists",
          aliases: [ "teams" ]
        }
        let teams = {
            name: profile.aliases[0],
            aliases: profile.aliases,
            description: profile.title,
            async execute(message, client, Discord) {
                let newEmbed = new MessageEmbed()
                    .setColor(profile.stripe)
                    .setTitle("***" + profile.title + "***")
                    // .setDescription(JSON.stringify(roster_aliases))
                    .setThumbnail(defaults.thumbnail)
                    .setFooter(defaults.footer.msg, defaults.footer.image)
                    .setTimestamp();
                let desc = "";
                for(let [gameID, teams] of Object.entries(roster_aliases)) {
                    let emojiName = gameID;
                    if(emojiName == "val") {
                        emojiName = "valorant";
                    }
                    for(let teamID in teams) {
                        if(teams.hasOwnProperty(teamID)) {
                            let teamName = teams[teamID].name;
                            desc += "<:" + emojiName + ":" + emojiIDs[message.guild.id][gameID] + ">";
                            desc += teamName;
                            desc += " (";
                            desc += "`" + teamID + "`";
                            if(teams[teamID].schedule) {
                                desc += "/";
                                desc += "`" + teamID + 's' + "`";
                            }
                            desc += ")";
                            desc += "\n";
                        }
                    }
                    desc += "\n";
                }
                newEmbed.setDescription(desc);
                message.channel.send(newEmbed);
            }
        }
        client.commands.set(profile.aliases[0], teams);
    }
}
