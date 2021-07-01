/*

Branded Generic Command Handler

BaseCommand
 VillainsCommand

*/

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
        this.errors = JSON.parse(fs.readFileSync("./dbs/errors.json", "utf8"))
    }

    async getArgs(message, args, flags) {
        let foundHandles = { players: {}, invalid: false, flags: flags }

        let user = message.author
        let mention = message.mentions.members.first()
        let search = (args && (args.length > 0) && (!(mention))) ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : undefined
        let loaded = undefined
        let debugout = []

        // If we have a User
        if (user) {
            // Load the User as the Target
            // Set the User Player
            loaded = user
            foundHandles.user = loaded
            foundHandles.loadedType = "user"
            foundHandles.players.user = {
                name: loaded.username,
                avatar: loaded.displayAvatarURL({ format: "png", dynamic: true })
            }
            debugout.push(`User: <@${loaded.id}>`)
        }

        // If we have a Mention
        if (mention) {
            // Load the Mention as the Target
            loaded = mention.user
            foundHandles.mention = loaded
            foundHandles.loadedType = "mention"
            debugout.push(`Mention: <@${loaded.id}>`)
        }

        // If we got stuff to Search for
        if (search) {
            // We already ran the search
            let tmp = search.size > 0
            // If there's results, get the first result
            // Otherwise, just gracefully degrade to our current Target
            loaded = tmp ? search.first() : loaded
            if (tmp && loaded) {
                debugout.push(`Terms: [Nick:${loaded.nickname}] [UName:${loaded.user.username}]`)
                loaded = loaded.user
                foundHandles.search = loaded
                foundHandles.loadedType = "search"
                debugout.push(`Search: <@${loaded.id}>`)
            }
        }

        // If we have calcualted a Target
        if (loaded) {
            // Make sure Loaded isn't from an Invalid source
            for (let handleType of ["user", "target"]) {
                if ((foundHandles.loadedType == handleType) && (flags[handleType] == "invalid")) {
                    foundHandles.invalid = handleType
                }
            }

            // If Loaded is a Bot
            // If Bot has been specified as a Valid source
            if (["default","required","optional"].indexOf(flags.bot) > -1) {
                // Do... something?
            } else if (loaded?.bot && loaded.bot) {
                // If Bot has been specified as in Invalid source
                // Set Invalid because Bot
                foundHandles.invalid = "bot"
            }
            foundHandles.loaded = loaded

            // Set Loaded as Target Player
            if (foundHandles.invalid === false) {
                foundHandles.players.target = {
                    name: loaded.username,
                    avatar: loaded.displayAvatarURL({ format: "png", dynamic: true })
                }
            }
            debugout.push(`Loaded: <@${loaded.id}>`)
        }

        // If we used a Search Term, do our best to remove it from Args list
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

        // Errors based on Invalid Source
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
        // If pages are being forced, set defaults
        if (forcepages) {
            emoji = ["◀️", "▶️"]
            timeout = "600000"
        }

        // If we have an array of page(s)
        if (Array.isArray(pages)) {
            // If it's just one and we're not forcing pages, just send the embed
            if ((pages.length <= 1) && !forcepages) {
                message.channel.send(pages[0])
            } else {
                // Else, set up for pagination
                // Sanity check for emoji pageturners
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
                // Send the pages
                await pagination(message, pages, emoji, timeout)
            }
        } else {
            // Else, it's just an embed, send it
            message.channel.send(pages)
        }
    }
}
