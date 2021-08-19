// Load a-djs-style Roster/Matches/Teams commands in a discord.js-style
//FIXME: Move toward a-djs-style loading

const fs = require('fs');
const MatchesCommand = require('../moody/commands/info/matches')
const RosterCommand = require('../moody/commands/info/roster')
const VillainsEmbed = require('../moody/classes/embed/vembed.class');

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

let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))

module.exports = (client, message, args) => {
    let dir = "./rosters"
    const rosters_profiles = walk(dir)
    let roster_aliases = {}

    for (const file of rosters_profiles) {
        if(file.includes("socials")) {
            continue;
        }
        let profile = JSON.parse(fs.readFileSync(file, "utf8"))

        if (profile.aliases) {
            let fileparts = file.split('/')
            let gameID = fileparts[fileparts.length - 2]
            let filename = fileparts[fileparts.length - 1].replace(".json","")

            if (Object.keys(roster_aliases).indexOf(gameID) == -1) {
                roster_aliases[gameID] = {}
            }
            roster_aliases[gameID][profile.aliases[0]] = {
                name: profile.title,
                schedule: "team" in profile
            }

            let rosterCommand = {
                name: profile.aliases[0],
                title: profile.title,
                aliases: profile.aliases,

                async execute(message) {
                    let command = new RosterCommand().run(
                        client,
                        message,
                        [
                            gameID,
                            filename
                        ]
                    )
                }
            }
            client.commands.set(rosterCommand.name, rosterCommand);

            if(file.indexOf("teams") !== -1) {
                let matchIDs = []
                if (profile.team?.tourneyID) {
                    matchIDs.push(profile.team.tourneyID)
                }
                if (profile.team?.teamID) {
                    matchIDs.push(profile.team.teamID)
                }
                let scheduleCommand = {
                    name: profile.aliases[0] + 's',
                    title: profile.title.replace("Roster","Schedule"),
                    aliases: [ profile.aliases[0] + 's' ],
                    async execute(message) {
                        let command = new MatchesCommand().run(
                            client,
                            message,
                            matchIDs
                        )
                    }
                }
                client.commands.set(scheduleCommand.name, scheduleCommand);
            }
        }
    }

    if (roster_aliases) {
        let profile = {
          title: "Team Lists",
          aliases: [ "teams" ]
        }
        let teams = {
            name: profile.aliases[0],
            aliases: profile.aliases,
            description: profile.title,
            async execute(message, client) {
                let props = {
                    title: { text: profile.title }
                }
                let desc = "";
                for (let [gameID, teams] of Object.entries(roster_aliases)) {
                    let emojiName = gameID;
                    if (emojiName == "staff") {
                        emojiName = "V1LLA1N"
                    } else if (emojiName == "val") {
                        emojiName = "valorant";
                    }
                    for (let teamID in teams) {
                        if (teams.hasOwnProperty(teamID)) {
                            let teamName = teams[teamID].name;
                            let cachedEmoji = message.guild.emojis.cache.find(emoji => emoji.name === emojiName);
                            if (cachedEmoji?.available) {
                                desc += `${cachedEmoji}`;
                            }

                            desc += teamName;
                            desc += " (";
                            desc += "`" + teamID + "`";
                            if (teams[teamID].schedule) {
                                desc += "/";
                                desc += "`" + teamID + 's' + "`";
                            }
                            desc += ")";
                            desc += "\n";
                        }
                    }
                    desc += "\n";
                }
                props.description = desc
                let embed = new VillainsEmbed(props)
                // message.channel.send({ embeds: [embed] }); // discord.js v13
                message.channel.send(embed);
            }
        }
        client.commands.set(profile.aliases[0], teams);
    }
}
