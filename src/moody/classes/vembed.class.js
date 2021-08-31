<<<<<<< HEAD:src/moody/classes/embed/vembed.class.js
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

/**
 * @class
 * @classdesc Build a Villains-branded Embed
 * @this {VillainsEmbed}
 * @extends {MessageEmbed}
 * @public
 */
=======
/*

Branded Generic Embed Handler

MessageEmbed
 VillainsEmbed

*/
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

>>>>>>> src:src/moody/classes/vembed.class.js
module.exports = class VillainsEmbed extends MessageEmbed {
    /**
     * @typedef {Object} EmbedField
     * @property {string} name Field Name
     * @property {string} value Field Value
     * @property {boolean} inline Inline?
     */
    /**
     * @typedef {Object} Player Player
     * @property {string} name The name
     * @property {string} url The URL
     * @property {string} avatar The Avatar
     */
    /**
     * @typedef {Object} EmbedProps Embed Properties
     * @property {boolean}                      full                    Print Full Embed
     * @property {string}                       color                   Stripe color
     * @property {{text: string}}               caption                 Caption text
     * @property {{text: string, url: string}}  title                   Title text & url
     * @property {string}                       thumbnail               Thumbnail url
     * @property {string}                       description             Body text
     * @property {Array.<EmbedField>}           fields                  Embed Fields
     * @property {string}                       image                   Body Image
     * @property {{msg: string, image: string}} footer                  Footer text & image
     * @property {number | boolean}             timestamp               Timestamp for footer
     * @property {boolean}                      error                   Print error format
     * @property {{bot: Player, user: Player, target: Player}} players  Players
     */

    /**
     * Constructor
     * @param {(EmbedProps | Object.<any>)} props Local list of command properties
     */
    constructor(props = {}) {
        if (
          (
            (!(props?.title?.text)) ||
            (props?.title?.text && (props.title.text.trim() == "" || props.title.text.trim() == "<NONE>"))
          ) &&
          (props?.title?.url && props.title.url.trim() != "")
        ) {
            props.title.text = "Source"
        }
        if (props?.description && Array.isArray(props.description)) {
            props.description = props.description.join("\n")
        }
        if ((!(props?.description)) || (props?.description && props.description.trim() == "")) {
            props.description = "** **"
        }
        if (typeof props.timestamp === undefined) {
            props.timestamp = true
        }

        super(
            {
                description: "Something got stuffed up here..."
            }
        )

        try {
<<<<<<< HEAD:src/moody/classes/embed/vembed.class.js
            /**
             * Global properties
             * @type {Object.<string, any>}
             */
            this.GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json", "utf8"))
            const defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
            this.GLOBALS = (
                this.GLOBALS?.profile &&
                this.GLOBALS?.profiles &&
                this.GLOBALS.profile in this.GLOBALS.profiles
            ) ?
                this.GLOBALS.profiles[this.GLOBALS.profile]:
                defaults
=======
            this.GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
>>>>>>> src:src/moody/classes/vembed.class.js
        } catch(err) {
            console.log("VEmbed: PROFILE manifest not found!")
            process.exit(1)
        }

        try {
<<<<<<< HEAD:src/moody/classes/embed/vembed.class.js
            /**
             * Package properties
             * @type {Object.<string, any>}
             */
=======
>>>>>>> src:src/moody/classes/vembed.class.js
            this.PACKAGE = JSON.parse(fs.readFileSync("./package.json","utf8"))
        } catch(err) {
            console.log("VEmbed: PACKAGE manifest not found!")
            process.exit(1)
        }

        try {
<<<<<<< HEAD:src/moody/classes/embed/vembed.class.js
            /**
             * Profile properties
             * @type {Object.<string, any>}
             */
            this.defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
=======
            this.defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))
>>>>>>> src:src/moody/classes/vembed.class.js
        } catch(err) {
            console.log("VEmbed: DEFAULTS manifest not found!")
            process.exit(1)
        }

<<<<<<< HEAD:src/moody/classes/embed/vembed.class.js
        /**
         * Development Mode?
         * @type {boolean}
         */
=======
>>>>>>> src:src/moody/classes/vembed.class.js
        this.DEV = this.GLOBALS.DEV

        if ((!(props?.color)) || (props?.color && props.color.trim() == "")) {
            switch (props.color) {
                default:
                    props.color = this.defaults.stripe;
                    break;
            }
        } else {
            props.color = this.defaults.stripe;
        }

        // Inbound footer message
        let haveFooterMsg = props?.footer?.msg

        // Inbound footer message and not "<NONE>"
        let footerMsgNotNone = haveFooterMsg && (props.footer.msg.trim() != "") && (props.footer.msg.trim() != "<NONE>")

        // We've got pages
        let havePages = props?.pages

        // Footer
        if(footerMsgNotNone) {
            // If we have an inbound footer
            if(this.DEV || havePages) {
                // If we need to repurpose the footer
                // Append sent footer message to description
                if(props.description != "") {
                    props.description += "\n\n"
                }
                props.description += ">>" + props.footer.msg
            }
        }

        // Hack in my stuff to differentiate
        if (this.DEV) {
            // Custom user footer
            props.color = this.GLOBALS["stripe"]
            props.footer = this.GLOBALS.footer
            this.setTimestamp()
        } else if((!haveFooterMsg) || (haveFooterMsg && (!footerMsgNotNone))) {
            // Default footer
            props.footer = this.defaults.footer
        }
        if (props?.footer?.msg) {
            if (!(props.footer.msg.includes(this.PACKAGE.version))) {
                props.footer.msg += ` [v${this.PACKAGE.version}]`
            }
            this.setFooter(props.footer.msg, props.footer.image)
        }

        // ERROR
        if (
          (props.error) ||
          (props?.title?.text && props.title.text.toLowerCase().includes("error")) ||
          (props?.description && props.description.toLowerCase().includes("***error***"))
        ) {
            props.color = "#ff0000" // RED
        }

        // Stripe
        this.setColor(props.color)

        // Avatars
        //  Default: Bot as Thumbnail
        //  Custom Thumbnail: Bot as Author
        //  Custom Thumbnail & Custom Author: No Bot

        let bot = { name: "Bot", avatar: this.defaults.thumbnail.trim() }
        if (!(props?.players)) {
            props.players = {
                bot: bot
            }
        } else if (!(props?.players?.bot)) {
            props.players.bot = bot
        }

        let avatars = {
            bot: {
                type: "bot",
                name: props.players.bot.name,
                url: props?.players?.bot?.url && props.players.bot.url.trim() != "" ? props.players.bot.url.trim() : "http://example.com/bot",
                avatar: props.players.bot.avatar
            },
            user: {
                type: "user",
                name: props?.players?.user?.name && props.players.user.name.trim() != "" ? props.players.user.name.trim() : "",
                url: props?.players?.user?.url && props.players.user.url.trim() != "" ? props.players.user.url.trim() : "http://example.com/user",
                avatar: props?.players?.user?.avatar && props.players.user.avatar.trim() != "" ? props.players.user.avatar.trim() : ""
            },
            target: {
                type: "target",
                name: props?.players?.target?.name && props.players.target.name.trim() != "" ? props.players.target.name.trim() : "",
                url: props?.players?.target?.url && props.players.target.url.trim() != "" ? props.players.target.url.trim() : "http://example.com/target",
                avatar: props?.players?.target?.avatar && props.players.target.avatar.trim() != "" ? props.players.target.avatar.trim() : ""
            },
            thumbnail: {},
            author: {}
        }

        // Default; put Bot in Thumbnail
        avatars.thumbnail = avatars.bot

        // Have a User, move Bot to Author
        if(avatars.user.avatar != "") {
            avatars.author = avatars.bot
            avatars.thumbnail = avatars.user

            if(avatars.target.avatar != "") {
                // Have a Target, move User to Author
                avatars.author = avatars.user
                avatars.thumbnail = avatars.target
            }
        }

        // Title
        if(props?.title?.text && props.title.text.trim() != "" && props.title.text.trim() != "<NONE>") {
            this.setTitle(props.title.text)
            if (props?.title?.url && props.title.url.trim() != "") {
                this.setURL(props.title.url.trim())
            }
        }

        // Author
        let author = props?.caption?.text && props.caption.text.trim() != "" ? props.caption.text.trim() : avatars.author.name
        if (author) {
            this.setAuthor(
                author,
                avatars.author.avatar,
                avatars.author.url
            )
        }

        // Thumbnail
        this.setThumbnail(avatars.thumbnail.avatar)

        // Body Description
        if (typeof props.description === "object") {
            props.description = props.description.join("\n")
        }
        this.setDescription(props.description)

        // Fields
        if (props?.fields?.length) {
            for (let field of props.fields) {
                let fName = field?.name ? field.name : ""
                let fVal = field?.value ? field.value : ""
                let fInl = field?.inline ? field.inline : false
                this.addField(fName, fVal, fInl)
            }
        }

        // Body Image
        if (props?.image != "") {
            this.setImage(props.image)
        }

        // Timestamp
        if(props?.timestamp && props.timestamp) {
            this.setTimestamp()
        }
    }
}
