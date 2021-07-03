/*

Branded Generic Command Handler

BaseCommand
 VillainsCommand

*/

const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('../classes/vembed.class');
const SlimEmbed = require('../classes/vslimbed.class');
const pagination = require('discord.js-pagination');

const fs = require('fs');

module.exports = class VillainsCommand extends BaseCommand {
    #DEV;       // Private: DEV flag
    #props;     // Private: Props to send to VillainsEmbed
    #flags;     // Private: Flags for user management
    #error;     // Private: Error Thrown
    #errors;    // Private: Global Error Message strings
    #inputData; // Private: Command Inputs

    constructor(comprops = {}, props = {}) {
        super(comprops)

        if (!(props?.caption?.text)) {
            if (!(props?.caption)) {
                props.caption = {}
            }
            props.caption.text = this.name.charAt(0).toUpperCase() + this.name.slice(1)
        }
        if (!(props?.title)) {
            props.title = {}
        }
        if (!(props?.description)) {
            props.description = ""
        }
        if (!(props?.players)) {
            props.players = {}
        }
        if (!(comprops?.flags)) {
            this.flags = {}
        } else {
            this.flags = comprops.flags
        }

        for (let [player, setting] of Object.entries({user:"default",target:"optional",bot:"invalid"})) {
            if (Object.keys(this.flags).indexOf(player) == -1) {
                this.flags[player] = setting
            }
        }

        const GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json", "utf8"))
        this.DEV = GLOBALS.DEV
        this.props = props
        this.title = props.title
        this.error = false
        this.errors = JSON.parse(fs.readFileSync("./dbs/errors.json", "utf8"))
        this.inputData = {}
    }

    get DEV() {
        return this.#DEV
    }
    set DEV(DEV) {
        this.#DEV = DEV
    }

    get props() {
        return this.#props
    }
    set props(props) {
        this.#props = props
    }

    get flags() {
        return this.#flags
    }
    set flags(flags) {
        this.#flags = flags
    }

    get error() {
        return this.#error
    }
    set error(error) {
        this.#error = error
    }

    get errors() {
        return this.#errors
    }
    set errors(errors) {
        this.#errors = errors
    }

    get inputData() {
        return this.#inputData
    }
    set inputData(inputData) {
        this.#inputData = inputData
    }

    async processArgs(message, args, flags = { user: "default", target: "invalid", bot: "invalid" }) {
        let foundHandles = { players: {}, invalid: false, flags: flags }

        let user = message.author
        let mention = message.mentions.members.first()
        let search = (args && (args.length > 0) && (!(mention))) ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : undefined
        let loaded = undefined
        let padding = 9
        let debugout = [ `Flags:`.padEnd(padding) + JSON.stringify(flags) ]

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
            // debugout.push(`User:`.padEnd(padding) + `<@${loaded.id}>`)
            debugout.push(`User:`.padEnd(padding) + `${loaded.username}`)
        }

        // If we have a Mention
        if (mention) {
            // Load the Mention as the Target
            loaded = mention.user
            foundHandles.mention = loaded
            foundHandles.loadedType = "mention"
            // debugout.push(`Mention:`.padEnd(padding) + `<@${loaded.id}>`)
            debugout.push(`Mention:`.padEnd(padding) + `${loaded.username}`)
        }

        // If we got stuff to Search for
        if (search) {
            // We already ran the search
            let tmp = search.size > 0
            // If there's results, get the first result
            // Otherwise, just gracefully degrade to our current Target
            loaded = tmp ? search.first() : loaded
            if (tmp && loaded) {
                debugout.push(`Terms:`.padEnd(padding) + `[Nick:${loaded.nickname}] [UName:${loaded.user.username}]`)
                loaded = loaded.user
                foundHandles.search = loaded
                foundHandles.loadedType = "search"
                // debugout.push(`Search:`.padEnd(padding) + `<@${loaded.id}>`)
                debugout.push(`Search:`.padEnd(padding) + `${loaded.username}`)
            }
        }
        debugout.push(`Type:`.padEnd(padding) + `${foundHandles.loadedType}`)

        // If we have calculated a Target
        if (loaded) {
            // Make sure Loaded isn't from an Invalid source
            for (let handleType of ["user", "target"]) {
                if ((foundHandles.loadedType == handleType) && (this.flags[handleType] == "invalid")) {
                    foundHandles.invalid = handleType
                }
            }
            if (this.flags.user == "invalid" && loaded.id == user.id) {
                foundHandles.invalid = "user"
            }

            // If Loaded is a Bot
            // If Bot has been specified as a Valid source
            if (["default","required","optional"].indexOf(this.flags.bot) > -1) {
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
            // debugout.push(`Loaded:`.padEnd(padding) + `<@${loaded.id}>`)
            debugout.push(`Loaded:`.padEnd(padding) + `${loaded.username}`)
        }

        debugout.push(`Invalid:`.padEnd(padding) + `${foundHandles.invalid}`)

        // If we used a Search Term, do our best to remove it from Args list
        try {
            if (args && args.length > 0) {
                debugout.push(`Args:`.padEnd(padding) + `[${args.join(" ")}]`)
                let re = /(?:\<)(?<PingChan>[\@\#]{1})(?<UsrRole>[\!\&]?)(?<ItemID>[\d]*)(?:\>)/
                let matches = args.join(" ").match(re)
                let cleansed = ""
                // debugout.push(`Matches:`.padEnd(padding) + `${matches}`)
                if (matches) {
                    matches.shift()
                    cleansed = args.join(" ").trim().replace(`<${matches.join("")}>`,"")
                } else {
                    cleansed = args.join(" ").trim()
                    for (let check of [`${loaded.username}#${loaded.discriminator}`, loaded.username]) {
                        cleansed = cleansed.toLowerCase().trim().replace(check.toLowerCase(),"")
                    }
                }
                foundHandles.argsArr = cleansed.trim().split(" ").filter(function(e) { return e != null && e != "" })
                cleansed = foundHandles.argsArr.join(" ")
                foundHandles.args = cleansed.trim()
                debugout.push(`Clean:`.padEnd(padding) + `[${cleansed.trim()}]`)
            }
        } catch(e) {
            console.log("---")
            console.log(e)
            console.log("---")
            console.log(debugout.join("\n"))
        }

        if (this.DEV && false) {
            console.log("---")
            console.log(debugout.join("\n"))
        }

        // Errors based on Invalid Source
        if (foundHandles?.invalid && foundHandles.invalid !== false) {
            this.error = true
            foundHandles.title = { text: "Error" };
            switch (foundHandles.invalid) {
                case "user":
                    foundHandles.description = this.errors.cantActionSelf.join("\n");
                    break;
                case "target":
                    foundHandles.description = this.errors.cantActionOthers.join("\n");
                    break;
                case "bot":
                    foundHandles.description = this.errors.cantActionBot.join("\n");
                    break;
                default:
                    break;
            }
        }

        this.inputData = foundHandles
        this.props.players = foundHandles.players
        this.props.title = foundHandles.title
        this.props.description = foundHandles.description
    }

    async action(client, message) {
        // Do nothing; command overrides this
        // If the thing doesn't modify anything, don't worry about DEV flag
        // If the thing does modify stuff, use DEV flag to describe action instead of performing it
        if(! this.DEV) {
            // Do the thing
        } else {
            // Describe the thing
        }
    }

    async build(client, message) {
        if(!(this.error)) {
            await this.action(client, message)
        }
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

    async run(client, message, args) {
        await this.processArgs(message, args, this.flags)

        await this.build(client, message)

        let embed = null
        if(this.props?.full && this.props.full) {
            embed = new VillainsEmbed(this.props)
        } else {
            embed = new SlimEmbed(this.props)
        }

        await this.send(message, embed)
    }
}
