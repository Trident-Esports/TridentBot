const fs = require('fs');

const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

function walk(dir) {
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

module.exports = class RosterCommand extends VillainsCommand {
    constructor() {
        super({
            name: "roster",
            category: "information",
            description: "Display a roster"
        })
    }

    async run(client, message, args) {
        let gameID = args[0] ? args[0].toLowerCase() : ""
        let teamType = args[1] ? args[1].toLowerCase() : ""
        let filepath = "./rosters/dbs"
        let profiles = []
        let socials = JSON.parse(fs.readFileSync("rosters/dbs/socials/users.json", "utf8"))

        if (gameID.indexOf("staff") == -1) {
            filepath += "/teams"
        }

        if (gameID != "") {
            if (gameID.startsWith("val")) {
                // val
                gameID = "val"
            } else if (gameID == "rl") {
                // rl -> rocketleague
                gameID = "rocketleague"
            }
            filepath += '/' + gameID
            if (teamType != "") {
                // show team
                filepath += '/' + teamType + ".json"
                profiles.push(filepath)
            } else {
                // show game
                profiles = walk(filepath)
            }
        } else {
            // show all
            profiles = walk(filepath)
        }

        let pages = []

        for (filepath of profiles) {
            let props = { caption: {}, author: {}, players: {} }
            let profile = JSON.parse(fs.readFileSync(filepath, "utf8"))
            let emojiIDs = JSON.parse(fs.readFileSync("dbs/emojis.json","utf8"))
            let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))

            // Title
            props.caption.text = profile.title

            let emoji = ""
            let emojiMatch = filepath.match(/(?:\.\/rosters\/dbs\/teams\/)([^\/]*)(.*)/)
            let emojiKey = emojiMatch ? emojiMatch[1] : ""
            let emojiName = emojiKey
            if (emojiName == "val") {
                emojiName = "valorant"
            }

            let foundEmoji = false

            let cachedEmoji = message.guild.emojis.cache.find(emoji => emoji.name === emojiName);
            if (cachedEmoji?.available) {
                foundEmoji = true
                desc += `${cachedEmoji}`;
            }

            if (!foundEmoji) {
                if (emojiKey) {
                    emoji += '[' + emojiKey + "] "
                }
            }

            props.description = emoji

            // Team URL
            if (profile?.url && profile.url != "") {
                props.caption.url = profile.url
            }
            if (profile?.team?.teamID) {
                let url = "http://villainsoce.mymm1.com/"
                let name = "LPL Team #"
                if(profile?.team?.tourneyID) {
                    url += "tourney/" + profile.team.tourneyID + '/'
                    name += profile.team.tourneyID + '/'
                }
                if(!(profile?.team?.tourneyID)) {
                    url += "team/"
                }
                url += profile.team.teamID
                name += profile.team.teamID
                props.description += `*[${name}](${url} '${url}')*`
                props.caption.url = url
            }

            let tmp = {
                name: props.caption.text,
                url: props.caption.url,
                avatar: defaults.thumbnail
            }
            props.players = {
                bot: {...tmp},
                user: {...tmp}
            }

            // Team Avatar
            if (profile?.team?.avatar && profile.team.avatar != "") {
                props.players.target = {...props.players.user}
                props.players.target.avatar = profile.team.avatar
            }

            let rosterEmbed = new VillainsEmbed(props)

            // Team Members
            if (profile?.members) {
                for (let [groupName, groupAttrs] of Object.entries(profile.members)) {
                    let userSTR = ""
                    if (groupAttrs?.users?.length == 0) {
                        groupAttrs.users = [ "TBA" ]
                    }
                    for (let user of groupAttrs.users) {
                        let social = socials[user]
                        let name = user.charAt(0).toUpperCase() + user.slice(1)
                        let userURL = ""
                        if (name != "TBA") {
                            if (!social) {
                                console.log("No socials for:",user)
                            } else {
                                if (social?.stylized && social.stylized.trim() != "") {
                                    name = social.stylized
                                }
                                if (social?.twitter && social.twitter.trim() != "") {
                                    userURL = "https://twitter.com/" + social.twitter
                                } else if (social?.twitch && social.twitch.trim() != "") {
                                    userURL = "https://twitch.tv/" + social.twitch
                                } else if (social?.instagram && social.instagram.trim() != "") {
                                    userURL = "https://instagram.com/" + social.instagram
                                }
                            }
                        }
                        if (userURL != "") {
                            userSTR += `[${name}](${userURL} '${userURL}')`
                        } else {
                            userSTR += name
                        }
                        userSTR += "\n"
                    }
                    rosterEmbed.addField(
                        groupAttrs.title,
                        userSTR,
                        false
                    )
                }

                pages.push(rosterEmbed)
            }

        }
        this.send(message, pages)
    }
}
