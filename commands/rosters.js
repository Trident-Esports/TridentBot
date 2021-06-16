const fs = require('fs')
const pagination = require('discord.js-pagination')
const { Message, MessageEmbed } = require('discord.js')

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

let profile = {
    "title": "Roster",
    "aliases": [ "roster" ]
}

module.exports = {
    name: profile.title,
    aliases: [ profile.aliases[0] ],
    description: profile.title,
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

        let gameID = args[0] ? args[0] : ""
        let teamType = args[1] ? args[1] : ""
        let filepath = "./rosters/dbs/teams"
        let profiles = []

        if(gameID != "") {
            filepath += '/' + gameID
            if(teamType != "") {
                filepath += '/' + teamType + ".json"
                profiles.push(filepath)
            } else {
                profiles = walk(filepath)
            }
        } else {
            profiles = walk(filepath)
        }

        let pages = []

        for(filepath of profiles) {
            let profile = JSON.parse(fs.readFileSync(filepath, "utf8"))

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

            let newEmbed = new MessageEmbed()
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
                newEmbed.addField(groupAttrs.title, userSTR, false);
            }

            pages.push(newEmbed)
        }
        const emoji = ["◀️", "▶️"]

        const timeout = '120000'

        pagination(message, pages, emoji, timeout)
    }
}
