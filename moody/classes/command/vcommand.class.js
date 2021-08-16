/*

Branded Generic Command Handler

BaseCommand
 VillainsCommand

TODO:
 Game
  Blackjack
  Fight
  Rob
 Matches
 Purge
 Roster

*/
const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('../classes/vembed.class');
const SlimEmbed = require('../classes/vslimbed.class');

const pagination = require('discord.js-pagination');
const fs = require('fs');

/**
 * Build a Villains-branded Command
 *
 * @class
 * @constructor
 * @public
 */
module.exports = class VillainsCommand extends BaseCommand {
    /**
     * @type {boolean} - Development Mode?
     * @private
     */
    #DEV;       // Private: DEV flag
    /**
     * @type {Object.<string, any>} - List of properties for embed manipulation
     * @private
     */
    #props;     // Private: Props to send to VillainsEmbed
    /**
     * @type {Array.<MessageEmbed>} - Array of embeds to print as pages or singly
     * @private
     */
    #pages;     // Private: Pages to print
    /**
     * @type {Object.<string, string>} - Flags for user management
     * @private
     */
    #flags;     // Private: Flags for user management
    /**
     * @type {boolean} - Set to true if we threw an error
     * @private
     */
    #error;     // Private: Error Thrown
    /**
     * @type {Object.<string, string>} - Global Error Message strings
     * @private
     */
    #errors;    // Private: Global Error Message strings
    /**
     * @type {Channel} - Channel to send embeds to
     * @private
     */
    #channel;   // Private: Channel to send VillainsEmbed to
    /**
     * @type {Object.<string, any>} - Processed input data
     * @private
     */
    #inputData; // Private: Command Inputs

    /**
     *
     * @param {Object.<string, any>} comprops - List of command properties from child class
     * @param {Object.<string, any>} props - Local list of command properties
     */
    constructor(comprops = {}, props = {}) {
        super(
            {...comprops}
        )

        this.props = {...props}

        if (!(this?.props?.full)) {
            this.props.full = true
        }
        if (!(this?.props?.caption?.text)) {
            if (!(props?.caption)) {
                this.props.caption = {}
            }
            this.props.caption.text = this.name.charAt(0).toUpperCase() + this.name.slice(1)
        }
        if (!(this?.props?.title)) {
            this.props.title = {}
        } else if (props?.title) {
            this.props.title = props.title
        }
        if (!(this?.props?.description)) {
            this.props.description = ""
        }
        if (!(this?.props?.footer)) {
            this.props.footer = {}
        }
        if (!(this?.props?.players)) {
            this.props.players = {}
        }
        if (!(comprops?.flags)) {
            this.flags = {}
        } else {
            this.flags = comprops.flags
        }

        for (let [player, setting] of Object.entries({user:"default",target:"optional",bot:"invalid",search:"valid"})) {
            if (Object.keys(this.flags).indexOf(player) == -1) {
                this.flags[player] = setting
            }
        }

        if (this?.props?.null && this.props.null) {
            this.null = true
        }

        const GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json", "utf8"))
        const DEFAULTS = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
        this.DEV = GLOBALS.DEV
        this.prefix = DEFAULTS.prefix
        this.pages = []
        this.error = false
        this.errors = JSON.parse(fs.readFileSync("./dbs/errors.json", "utf8"))
        this.inputData = {}

        // Bail if we fail to get server profile information
        if (!GLOBALS) {
            this.error = true
            this.props.description = "Failed to get server profile information."
            return
        }
        // Bail if we fail to get bot default information
        if (!DEFAULTS) {
            this.error = true
            this.props.description = "Failed to get bot default information."
            return
        }
        // Bail if we fail to get command prefix
        if (!this.prefix) {
            this.error = true
            this.props.description = "Failed to get command prefix."
            return
        }
        // Bail if we fail to get error message information
        if (!(this.errors)) {
            this.error = true
            this.props.description = "Failed to get error message information."
            return
        }
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

    get pages() {
        return this.#pages
    }
    set pages(pages) {
        this.#pages = pages
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

    get channel() {
        return this.#channel
    }
    set channel(channel) {
        this.#channel = channel
    }

    get inputData() {
        return this.#inputData
    }
    set inputData(inputData) {
        this.#inputData = inputData
    }

    /**
     *
     * @param {Message} message - Message that called the command
     * @param {string} channelType - Key for channel to get from database
     * @returns {Channel} - Found channel object
     */
    async getChannel(message, channelType) {
        // Get botdev-defined list of channelIDs/channelNames
        let channelIDs = JSON.parse(fs.readFileSync("./dbs/channels.json","utf8"))
        let channelID = this.channelName
        let channel = null

        if (channelIDs) {
            // Get channel IDs for this guild
            if (Object.keys(channelIDs).includes(message.guild.id)) {
                // If the channel type exists
                if (Object.keys(channelIDs[message.guild.id]).includes(channelType)) {
                    // Get the ID
                    channelID = channelIDs[message.guild.id][channelType]
                }
            }
        }

        // If the ID is not a number, search for a named channel
        if (isNaN(channelID)) {
            channel = message.guild.channels.cache.find(c => c.name === channelID);
        } else {
            // Else, search for a numbered channel
            channel = message.guild.channels.cache.find(c => c.id === channelID);
        }

        return channel
    }

    /**
     *
     * @param {Message} message - Message that called the command
     * @param {string[]} args - Command-line args
     * @param {Object.<string, string>} flags - Flags for user management
     */
    async processArgs(message, args, flags = { user: "default", target: "invalid", bot: "invalid", search: "valid" }) {
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
            for (let handleType of ["mention", "search", "user", "target"]) {
                if ((foundHandles.loadedType == handleType) && (this.flags[handleType] == "invalid")) {
                    foundHandles.invalid = handleType
                }
            }
            if (this.flags.user == "invalid" && loaded.id == user.id) {
                foundHandles.invalid = "user"
            }

            // If Loaded is a Bot
            // If Bot has been specified as a Valid source
            // Get Bot whitelist
            let USERIDS = JSON.parse(fs.readFileSync("./dbs/userids.json","utf8"))
            // Bail if we fail to get UserIDs list
            if (!USERIDS) {
                this.error = true
                this.props.description = "Failed to get UserIDs list."
                return
            }
            // Fake an empty Bot Whitelist
            if (!(USERIDS?.botWhite)) {
                USERIDS["botWhite"] = []
            }
            if (["default","required","optional"].includes(this.flags.bot)) {
                // Do... something?
            } else if (loaded?.bot && loaded.bot && (USERIDS?.botWhite.indexOf(loaded.id) == -1)) {
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
                    for (let check of [
                        `${loaded.username}#${loaded.discriminator}`,
                        loaded.username,
                        `${loaded.username}#${loaded.discriminator}`.toLowerCase(),
                        loaded.username.toLowerCase()
                    ]) {
                        cleansed = cleansed.trim().replace(check,"")
                    }
                }
                foundHandles.argsArr = cleansed.trim().split(" ").filter(function(e) { return e != null && e != "" })
                cleansed = foundHandles.argsArr.join(" ")
                foundHandles.args = cleansed.trim().split(" ")
                debugout.push(`Clean:`.padEnd(padding) + `[${cleansed}]`)
            } else {
                foundHandles.args = [ "" ]
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
                case "mention":
                    foundHandles.description = this.errors.cantActionMention.join("\n");
                    break;
                case "search":
                    foundHandles.description = this.errors.cantActionSearch.join("\n");
                    break;
                default:
                    break;
            }
        }

        this.inputData = foundHandles
        this.props.players = foundHandles.players
        this.props.title = foundHandles?.title ? foundHandles.title : this.props.title
        this.props.description = foundHandles?.description ? foundHandles.description : this.props.description
    }

    /**
     * Execute command and build embed
     *
     * @param {Client} client - Discord Client object
     * @param {Message} message - Message that called the command
     */
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

    /**
     * Build pre-flight characteristics of AdminCommand
     *
     * @param {Client} client - Discord Client object
     * @param {Message} message - Message that called the command
     */
    async build(client, message, cmd) {
        if(!(this.error)) {
            await this.action(client, message, cmd)
        }
    }

    /**
     * Send pages to Discord Client
     *
     * @param {Message} message - Message that called the command
     * @param {VillainsEmbed[]} pages - Pages to send to client
     * @param {string[]} emojis - Emoji for pagination
     * @param {string} timeout - Timeout for disabling pagination
     * @param {boolean} forcepages - Force pagination
     */
    async send(message, pages, emojis = ["◀️", "▶️"], timeout = "600000", forcepages = false) {
        if (!this.channel) {
            this.channel = message.channel
        }
        // If pages are being forced, set defaults
        if (forcepages) {
            emojis = ["◀️", "▶️"]
            timeout = "600000"
        }

        // If we have an array of page(s)
        if (Array.isArray(pages)) {
            // If it's just one and we're not forcing pages, just send the embed
            if ((pages.length <= 1) && !forcepages) {
                return this.channel.send(pages[0])
            } else {
                // Else, set up for pagination
                // Sanity check for emoji pageturners
                let filler = "🤡"
                if (emojis.length !== 2) {
                    if (emojis.length == 1) {
                        emojis.push(filler)
                    } else if (emojis.length >= 3) {
                        emojis = emojis.slice(0,2)
                    }
                }
                if (emojis[0] == emojis[1]) {
                    emojis = emojis.slice(0,1)
                    emojis.push(filler)
                }
                // Send the pages
                return await pagination(message, pages, emojis, timeout)
            }
        } else {
            // Else, it's just an embed, send it
            return this.channel.send(pages)
        }
    }

    /**
     * Run the command
     *
     * @param {Client} client - Discord Client object
     * @param {Message} message - Message that called the command
     * @param {string[]} args - Command-line args
     * @param {string} cmd - Actual command name used (alias here if alias used)
     */
    async run(client, message, args, cmd) {
        // Process arguments
        await this.processArgs(message, args, this.flags)

        // Build the thing
        await this.build(client, message, cmd)

        // If we have an error, make it errortastic
        if (this.error) {
            if (this.props?.title) {
                this.props.title.text = "Error"
            } else if (this.props?.caption) {
                this.props.caption.text = "Error"
            }
        }

        // If we just got an embed, let's check to see if it's a full page or slim page
        // Toss it in pages as a single page
        if(this.pages.length == 0) {
            if(this.props?.full && this.props.full) {
                this.pages.push(new VillainsEmbed({...this.props}))
            } else {
                this.pages.push(new SlimEmbed({...this.props}))
            }
        }

        // this.null is to be set if we've already sent the page(s) somewhere else
        // Not setting this.null after sending the page(s) will send the page(s) again
        if ((!(this?.null)) || (this?.null && (!(this.null)))) {
            await this.send(message, this.pages)
        }
    }
}
