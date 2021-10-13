//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const fs = require('fs');

function walk(dir, filext = ".json") {
    let results = [];
    if (fs.existsSync(dir)) {
        let list = fs.readdirSync(dir);
        list.forEach(function (file) {
            file = dir + '/' + file;
            let stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = results.concat(walk(file));
            } else {
                /* Is a JSON file */
                if (file.endsWith(filext)) {
                    results.push(file);
                }
            }
        });
    } else {
        console.log(`FS Walk: '${dir}' doesn't exist!`);
    }
    return results;
}

module.exports = class RosterCommand extends VillainsCommand {
    constructor() {
        super(
            {
                name: "roster",
                category: "information",
                description: "Display a roster"
            }
        )
    }

    async run(client, message, args) {
        let guilds = JSON.parse(fs.readFileSync("./src/dbs/guilds.json","utf8"))
        let org = message.guild.id in Object.keys(guilds) ? guilds[message.guild.id] : "tdnt"
        let gameID = args[0] ? args[0].toLowerCase() : ""
        let teamType = args[1] ? args[1].toLowerCase() : ""
        let filepath = "./src/rosters/dbs"
        filepath += '/' + org
        let profiles = []
        let socials = JSON.parse(fs.readFileSync("./src/rosters/dbs/socials/users.json", "utf8"))

        if (!(gameID.includes("staff"))) {
            filepath += "/teams"
        }

        if (gameID != "") {
            if (gameID.startsWith("cs")) {
                // cs -> csgo
                gameID = "csgo"
            } else if (gameID.startsWith("r6")) {
                // r6 -> r6s
                gameID = "r6s"
            } else if (gameID == "rl") {
                // rl -> rocketleague
                gameID = "rocketleague"
            } else if (gameID.startsWith("val")) {
                // valorant -> val
                gameID = "val"
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

        if (profiles.length == 0) {
            this.error = true
            this.props.description = `No data for '${gameID}' found!`
            this.send(message, new VillainsEmbed(this.props))
            return
        }

        let pages = []

        for (filepath of profiles) {
            let props = { caption: {}, author: {}, players: {} }
            let profile = JSON.parse(fs.readFileSync(filepath, "utf8"))
            let defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))

            // Title
            props.caption.text = profile.title

            let emojiMatch = filepath.match(/(?:\/teams\/)([^\/]*)(.*)/)
            let emojiKey = emojiMatch ? emojiMatch[1] : ""
            let emoji = await this.getEmoji(emojiKey, message.guild.emojis)

            props.description = emoji

            // LPL Team URL
            if (profile?.url && profile.url != "") {
                props.caption.url = profile.url
            }
            let tourneyID = 0
            let teamID = 0
            if (profile?.team?.tourneyID) {
                tourneyID = profile.team.tourneyID
            }
            if (profile?.team?.lpl?.tourneyID) {
                tourneyID = profile.team.lpl.tourneyID
            }
            if (profile?.team?.teamID) {
                teamID = profile.team.teamID
            }
            if (profile?.team?.lpl?.teamID) {
                teamID = profile.team.lpl.teamID
            }
            if (teamID > 0) {
                let url = "http://tridentoce.mymm1.com/"
                let name = "LPL Team #"
                if(tourneyID > 0) {
                    url += "tourney/" + tourneyID + '/'
                    name += tourneyID + '/'
                }
                if(tourneyID == 0) {
                    url += "team/"
                }
                url += teamID
                name += teamID
                props.description += `*[${name}](${url} '${url}')*` + "\n"
                props.caption.url = url
            }

            // ESEA URL
            emoji = await this.getEmoji("esea", message.guild.emojis)
            teamID = 0
            if (profile?.team?.esea?.teamID) {
                teamID = profile.team.esea.teamID
            }
            if (teamID > 0) {
                let url = "http://play.esea.net/"
                let name = "ESEA Team #"
                if(tourneyID == 0) {
                    url += "teams/"
                }
                url += teamID
                name += teamID
                props.description += emoji + `*[${name}](${url} '${url}')*` + "\n"
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
            let avatar = ""
            if (profile?.team?.avatar && profile.team.avatar != "") {
                avatar = profile.team.avatar
            }
            if (profile?.team?.lpl?.avatar && profile.team.lpl.avatar != "") {
                avatar = profile.team.lpl.avatar
            }
            if (avatar != "") {
                props.players.target = {...props.players.user}
                props.players.target.avatar = avatar
            }

            let rosterEmbed = new VillainsEmbed({...props})

            // Team Members
            if (profile?.members) {
                let management = JSON.parse(fs.readFileSync("./src/rosters/dbs/" + org + "/staff/management.json","utf8"))
                if (management?.members) {
                    for (let groupName of (Object.keys(profile.members).concat([emojiKey]))) {
                        if (Object.keys(management.members).includes(groupName)) {
                            if (management.members[groupName]?.users) {
                                let newmembers = {
                                    managers: {
                                        title: "Manager",
                                        users: management.members[groupName].users
                                    },
                                    ...profile.members
                                }
                                profile.members = newmembers
                            }
                        }
                    }
                }
                for (let [, groupAttrs] of Object.entries(profile.members)) {
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

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "valorant",
          "valorant sirens"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new RosterCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args)
        }
    }
}
