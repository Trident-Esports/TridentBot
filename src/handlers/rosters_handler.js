// Load a-djs-style Roster/Matches/Teams commands in a discord.js-style
//FIXME: Move toward a-djs-style loading

const fs = require('fs');
const MatchesCommand = require('../moody/commands/info/matches')
const LeagueCommand = require('../moody/commands/info/league')
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

module.exports = (client) => {
    let dir = "./src/rosters/dbs"
    let org = "tdnt"
    dir += '/' + org
    const rosters_profiles = walk(dir)
    let roster_aliases = {}

    for (const file of rosters_profiles) {
        if(file.includes("socials")) {
            continue;
        }
        let profile = JSON.parse(fs.readFileSync(file, "utf8"))

        if (!profile) {
            console.log(`🟡Failed to get roster: ${file}`)
        }

        if (profile?.aliases) {
            let fileparts = file.split('/')
            let gameID = fileparts[fileparts.length - 2]
            let filename = fileparts[fileparts.length - 1].replace(".json","")

            if (!(Object.keys(roster_aliases).includes(gameID))) {
                roster_aliases[gameID] = {}
            }
            roster_aliases[gameID][profile.aliases[0]] = {
                name: profile.title,
                schedule: "team" in profile,
                league: "league" in profile
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

            if(file.includes("teams")) {
                let matchIDs = []
                if (profile.team?.tourneyID) {
                    matchIDs.push(profile.team.tourneyID)
                }
                if (profile.team?.teamID) {
                    matchIDs.push(profile.team.teamID)
                }
                if (profile.team?.lpl?.tourneyID) {
                    matchIDs.push(profile.team.lpl.tourneyID)
                }
                if (profile.team?.lpl?.teamID) {
                    matchIDs.push(profile.team.lpl.teamID)
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

                if ((profile?.team?.teamID || profile?.team?.lpl?.teamID) && profile?.league?.game && profile?.league?.level) {
                    let teamID = 0
                    if (profile?.team?.teamID) {
                        teamID = profile.team.teamID
                    }
                    if (profile?.team?.lpl?.teamID) {
                        teamID = profile.team.lpl.teamID
                    }
                    let leagueCommand = {
                        name: profile.aliases[0] + 'l',
                        title: profile.title.replace("Roster", "League Schedule"),
                        async execute(message) {
                            let command = new LeagueCommand().run(
                                client,
                                message,
                                [ profile.league.game, profile.league.level, teamID ]
                            )
                        }
                    }
                    client.commands.set(leagueCommand.name, leagueCommand);
                }
            }
        }
    }

    if (roster_aliases) {
        let profile = {
          title: "Team Lists",
          aliases: [ "teams" ]
        }
        let teamsCommand = {
            name: profile.aliases[0],
            aliases: profile.aliases,
            description: profile.title,
            async execute(message) {
                let props = {
                    title: { text: profile.title }
                }
                let desc = "";
                for (let [gameID, teams] of Object.entries(roster_aliases)) {
                    let emojiName = gameID;
                    if (emojiName == "staff") {
                        emojiName = "logo_trident"
                    } else if (emojiName == "val") {
                        emojiName = "valorant";
                    }
                    for (let teamID in teams) {
                        if (teams.hasOwnProperty(teamID)) {
                            let teamName = teams[teamID].name;
                            let cachedEmoji = await message.guild.emojis.cache.find(emoji => emoji.name === emojiName);
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
                            if (teams[teamID].league) {
                                desc += "/";
                                desc += "`" + teamID + 'l' + "`";
                            }
                            desc += ")";
                            desc += "\n";
                        }
                    }
                    desc += "\n";
                }
                props.description = desc
                let embed = new VillainsEmbed({...props})
                // message.channel.send({ embeds: [embed] }); // discord.js v13
                message.channel.send(embed);
            }
        }
        client.commands.set(teamsCommand.name, teamsCommand);
    }
}
