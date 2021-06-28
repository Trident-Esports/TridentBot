const fs = require('fs');

const VillainsCommand = require('../classes/vcommand.class');
const VillainsEmbed = require('../classes/vembed.class');

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
        let gameID = args[0] ? args[0] : ""
        let teamType = args[1] ? args[1] : ""
        let filepath = "./rosters/dbs/teams"
        let profiles = []
        let socials = JSON.parse(fs.readFileSync("rosters/dbs/socials/users.json", "utf8"))

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
            let props = { title: {}, author: {} }
            let profile = JSON.parse(fs.readFileSync(filepath, "utf8"))

            // Title
            props.title.text = profile.title

            // Team URL
            if (profile?.team?.teamID) {
                //FIXME: Doesn't work for Tourney handler
                props.title.url = "http://villainsoce.mymm1.com/team/" + profile.team.teamID
            }

            // Team Avatar
            if (profile?.team?.avatar && profile.team.avatar != "") {
                props.thumbnail = profile.team.avatar
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
                            userSTR += '[' + name + "](" + userURL + ')'
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
