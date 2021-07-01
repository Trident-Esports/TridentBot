const { BaseCommand } = require('a-djs-handler');
const pagination = require('discord.js-pagination');

const fs = require('fs');

module.exports = class VillainsCommand extends BaseCommand {
    constructor(comprops = {}, props = { caption: {}, title: {}, description: "", players: {} }) {
        super(comprops)
        if (!(props?.caption?.text)) {
            if (!(props?.caption)) {
                props.caption = {}
            }
            props.caption.text = this.name.charAt(0).toUpperCase() + this.name.slice(1)
        }
        this.props = props
        this.errors = JSON.parse(fs.readFileSync("game/dbs/errors.json", "utf8"))
    }

    async getArgs(message, args, flags) {
        let foundHandles = { players: {}, invalid: false, flags: flags }

        let user = message.author
        let mention = message.mentions.members.first()
        let search = (args && (args.length > 0) && (!(mention))) ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : undefined
        let loaded = undefined
        let debugout = []

        if (user) {
            loaded = user
            foundHandles.user = loaded
            foundHandles.loadedType = "user"
            foundHandles.players.user = {
                name: loaded.username,
                avatar: loaded.displayAvatarURL({ format: "png", dynamic: true })
            }
            debugout.push(`User: <@${loaded.id}>`)
        }
        if (mention) {
            loaded = mention.user
            foundHandles.mention = loaded
            foundHandles.loadedType = "mention"
            debugout.push(`Mention: <@${loaded.id}>`)
        }
        if (search) {
            let tmp = search.size > 0
            loaded = tmp ? search.first() : loaded
            if (tmp && loaded) {
                debugout.push(`Terms: [Nick:${loaded.nickname}] [UName:${loaded.user.username}]`)
                loaded = loaded.user
                foundHandles.search = loaded
                foundHandles.loadedType = "search"
                debugout.push(`Search: <@${loaded.id}>`)
            }
        }
        if (loaded) {
            for (let handleType of ["user", "target"]) {
                if ((foundHandles.loadedType == handleType) && (flags[handleType] == "invalid")) {
                    foundHandles.invalid = handleType
                }
            }
            if (["default","required","optional"].indexOf(flags.bot) > -1) {
            } else if (loaded?.bot && loaded.bot) {
                foundHandles.invalid = "bot"
            }
            foundHandles.loaded = loaded
            if (foundHandles.invalid === false) {
                foundHandles.players.target = {
                    name: loaded.username,
                    avatar: loaded.displayAvatarURL({ format: "png", dynamic: true })
                }
            }
            debugout.push(`Loaded: <@${loaded.id}>`)
        }

        try {
            if (args && args.length > 0) {
                debugout.push(`Args: [${args.join(" ")}]`)
                let re = /(?:\<)(?<PingChan>[\@\#]{1})(?<UsrRole>[\!\&]?)(?<ItemID>[\d]*)(?:\>)/
                let matches = args.join(" ").match(re)
                let cleansed = ""
                // debugout.push(`Matches: ${matches}`)
                if (matches) {
                    matches.shift()
                    cleansed = args.join(" ").trim().replace(`<${matches.join("")}>`,"")
                } else {
                    cleansed = args.join(" ").trim()
                    for (let check of [`${loaded.username}#${loaded.discriminator}`, loaded.username]) {
                        cleansed = cleansed.trim().replace(check,"")
                    }
                }
                foundHandles.argsArr = cleansed.trim().split(" ").filter(function(e) { return e != null && e != "" })
                cleansed = foundHandles.argsArr.join(" ")
                foundHandles.args = cleansed.trim()
                debugout.push(`Clean: [${cleansed.trim()}]`)
            }
        } catch(e) {
            console.log("---")
            console.log(e)
            console.log("---")
            console.log(debugout.join("\n"))
        }

        if (foundHandles?.invalid && foundHandles.invalid !== false) {
            foundHandles.title = { text: "Error" };
            switch (foundHandles.invalid) {
                case "user":
                    foundHandles.description = "You can't target yourself!";
                    break;
                case "target":
                    foundHandles.description = "You can't target others!";
                    break;
                case "bot":
                    foundHandles.description = this.errors.cantActionBot.join("\n");
                    break;
                default:
                    break;
            }
        }

        return foundHandles
    }

    async send(message, pages, emoji = ["◀️", "▶️"], timeout = "600000", forcepages = false) {
        if (forcepages) {
            emoji = ["◀️", "▶️"]
            timeout = "600000"
        }
        if (Array.isArray(pages)) {
            if ((pages.length <= 1) && !forcepages) {
                message.channel.send(pages[0])
            } else {
                let filler = "🤡"
                if (emoji.length !== 2) {
                    if (emoji.length == 1) {
                        emoji.push(filler)
                    } else if (emoji.length >= 3) {
                        emoji = emoji.slice(0,2)
                    }
                }
                if (emoji[0] == emoji[1]) {
                    emoji = emoji.slice(0,1)
                    emoji.push(filler)
                }
                await pagination(message, pages, emoji, timeout)
            }
        } else {
            message.channel.send(pages)
        }
    }
}
