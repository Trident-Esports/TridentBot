const fs = require('fs');
const path = require("path")

const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js");

let walk = function(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
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
let defaults = JSON.parse(fs.readFileSync("rosters/dbs/defaults.json", "utf8"))
let socials = JSON.parse(fs.readFileSync("rosters/dbs/socials/users.json", "utf8"))

module.exports = (client, Discord) => {
    let dir = "./rosters"
    const rosters_profiles = walk(dir)

    for (const file of rosters_profiles) {
        let profile = JSON.parse(fs.readFileSync(file, "utf8"))

        let stripe = profile["stripe"]

        switch(stripe) {
            default:
                stripe = "#B2EE17";
                break;
        }

        // Hack in my stuff to differentiate
        if(GLOBALS.DEV) {
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

                for(let [groupName, groupAttrs] of Object.entries(profile.members)) {
                    let userSTR = "";
                    for(let user of groupAttrs.users) {
                        let social = socials[user];
                        if(!social) {
                            console.log(user);
                        }
                        let name = user.charAt(0).toUpperCase() + user.slice(1);
                        let userURL = "";
                        if(social.stylized !== undefined) {
                            name = social.stylized;
                        }
                        if(social.twitch !== undefined) {
                            userURL = "https://twitch.tv/" + social.twitch;
                        } else if(social.twitter !== undefined) {
                            userURL = "https://twitter.com/" + social.twitter;
                        }
                        if(userURL != "") {
                            userSTR += "[";
                        }
                        userSTR += name;
                        if(userURL != "") {
                            userSTR += "](" + userURL + ")";
                        }
                        userSTR += "\n";
                    }
                    newEmbed.addField(groupAttrs.title,userSTR,false);
                }

                message.channel.send(newEmbed);
            }
        }
        if (roster.name) {
            client.commands.set(roster.name, roster);
        } else {
            continue;
        }
    }
}
