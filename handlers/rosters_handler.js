const fs = require('fs')
const path = require("path")
const dasu = require('dasu')

const Discord = require('discord.js')
const {
    MessageEmbed
} = require("discord.js");

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

    for (const file of rosters_profiles) {
        let profile = JSON.parse(fs.readFileSync(file, "utf8"))

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
            name: profile.title,
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

                for (let [groupName, groupAttrs] of Object.entries(profile.members)) {
                    let userSTR = "";
                    for (let user of groupAttrs.users) {
                        let social = socials[user];
                        if (!social) {
                            console.log(user);
                        }
                        let name = user.charAt(0).toUpperCase() + user.slice(1);
                        let userURL = "";
                        if (social) {
                            if (social.stylized !== undefined) {
                                name = social.stylized;
                            }
                            if (social.twitch !== undefined) {
                                userURL = "https://twitch.tv/" + social.twitch;
                            } else if (social.twitter !== undefined) {
                                userURL = "https://twitter.com/" + social.twitter;
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
                    newEmbed.addField(groupAttrs.title, userSTR, false);
                }

                message.channel.send(newEmbed);
            }
        }
        let schedule = null
        if(file.indexOf("teams") !== -1) {
            schedule = {
                name: profile.title + " Schedule",
                aliases: profile.aliases[0] + 's',
                description: profile.title + " Schedule",
                async execute(message, client, Discord) {

                    let req = dasu.req

                    let params = {
                        method: 'GET',
                        protocol: 'http',
                        hostname: 'villainsoce.mymm1.com',
                        port: 80,
                        path: '/team/' + profile.team.teamID + '.json',
                    }

                    req(params, function (err, res, data) {
                        let json = JSON.parse(data);
                        let game_details = json["events"];

                        let newEmbed = new MessageEmbed()
                            .setColor(profile.stripe)
                            .setTitle("***" + profile.title + " Schedule***")
                            .setURL("http://villainsoce.mymm1.com/team/" + profile.team.teamID)
                            // .setDescription()
                            .setThumbnail(defaults.thumbnail)
                            .setFooter(defaults.footer.msg, defaults.footer.image)
                            .setTimestamp();

                        let fields = []
                        for(let [timestamp,match] of Object.entries(game_details)) {
                            let name = "";
                            let value = "";
                            if(match.discord.status == "complete") {
                                name += "✅";
                                value += "Started";
                            } else {
                                let emojiName = match.discord.game;
                                let icons = {
                                    "745409743593406634": {
                                        "csgo": "852599076541169694",
                                        "val": "852599150654783529"
                                    },
                                    "788021898146742292": {
                                        "csgo": "852596632335548417",
                                        "val": "852596728732581899"
                                    }
                                }
                                if(emojiName == "val") {
                                    emojiName = "valorant";
                                }
                                name += "<:" + emojiName + ":" + icons[message.guild.id][match.discord.game] + ">";
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
                            fields.push(
                                {
                                    name: name,
                                    value: value
                                }
                            )
                        }

                        newEmbed.addFields(fields);
                        message.channel.send(newEmbed);
                    });
                }
            }
        }
        if (roster.name) {
            client.commands.set(roster.name, roster);
            if(schedule) {
                client.commands.set(roster.name + " Schedule", schedule);
            }
        }
    }
}
