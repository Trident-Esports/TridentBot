// @ts-nocheck

const VillainsCommand = require('./vcommand.class');

const fs = require('fs');

/**
 * @class
 * @classdesc Build a Command for BotDevs-only
 * @this {BotDevCommand}
 * @extends {VillainsCommand}
 * @public
 */
module.exports = class BotDevCommand extends VillainsCommand {
    /**
     * @type {Array.<string>} - List of userids as provided by server profile database file
     * @private
     */
    #USERIDS; // Private: USERIDS

    /**
     * Constructor
     * @param {CommandInfo} comprops List of command properties from child class
     * @param {EmbedProps} props              Local list of command properties
     */
    constructor(client, comprops, props) {
        // Create a parent object
        super(
            client,
            {...comprops},
            {...props}
        )

        // Load requested extensions
        if (props?.extensions) {
            for (let extension of props.extensions) {
                let key = extension + "Model"
                let inc = "../../models/" + extension + "Schema"
                if (extension == "levels") {
                    key = "Levels"
                    inc = "discord-xp"
                } else if (extension == "xpboost") {
                    key = "XPBoostModel"
                }
                this[key] = require(inc)
            }
        }

        // Get botdev-defined list of userids of BotDevs
        /**
         * @type {Object.<[x:string], Array.<string>>} - List of userids as provided by server profile database file
         * @public
         */
        try {
            this.USERIDS = JSON.parse(fs.readFileSync("./src/dbs/userids.json", "utf8")).botDevs
        } catch {
            // Bail if we fail to get UserIDs list
            this.USERIDS = { "botDevs": [""], "botWhite": [""] }
            this.error = true
            this.props.description = "Failed to get UserIDs list."
            return
        }
    }

    /**
     * Get USERIDS
     *
     * @returns {Object.<[x:string], Array.<string>>} - List of saved userids
     */
    get USERIDS() {
        return this.#USERIDS
    }
    /**
     * Set USERIDS
     *
     * @param {Object.<[x:string], Array.<string>>} USERIDS - List of userids to set
     */
    set USERIDS(USERIDS) {
        this.#USERIDS = USERIDS
    }

    async build(client, message) {
        // Bail if not valid UserID
        if(!(this.USERIDS.includes(message.author.id))) {
            this.error = true
            // @ts-ignore
            this.props.description = this.errors.botDevOnly.join("\n")
            return
        } else {
            await this.action(client, message)
        }
    }
}
