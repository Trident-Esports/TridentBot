const VillainsCommand = require('./vcommand.class');

const fs = require('fs');

/**
 * Build a Command for BotDevs only
 *
 * @class
 * @constructor
 * @public
 */
module.exports = class BotDevCommand extends VillainsCommand {
    /**
     * @type {string[]} - List of userids as provided by server profile database file
     * @private
     */
    #USERIDS; // Private: USERIDS

    /**
     *
     * @param {Object.<string, any>} comprops - List of command properties from child class
     * @param {Object.<string, any>} props - Local list of command properties
     */
    constructor(comprops = {}, props = { title: {}, description: "" }) {
        // Create a parent object
        super(
            {...comprops},
            {...props}
        )

        // Load requested extensions
        if (comprops?.extensions) {
            for (let extension of comprops.extensions) {
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
         * @type {string[]} - List of userids as provided by server profile database file
         * @public
         */
        this.USERIDS = JSON.parse(fs.readFileSync("./dbs/userids.json", "utf8")).botDevs

        // Bail if we fail to get UserIDs list
        if (!(this.USERIDS)) {
            this.USERIDS = { botDevs: [], botWhite: [] }
            this.error = true
            this.props.description = "Failed to get UserIDs list."
            return
        }
    }

    /**
     * Get USERIDS
     *
     * @returns {string[]} - List of saved userids
     */
    get USERIDS() {
        return this.#USERIDS
    }
    /**
     * Set USERIDS
     *
     * @param {string[]} USERIDS - List of userids to set
     */
    set USERIDS(USERIDS) {
        this.#USERIDS = USERIDS
    }

    /**
      * @param {Client} client - Discord Client object
      * @param {Message} message - Message that called the command
     */
    async build(client, message) {
        // Bail if not valid UserID
        if(this.USERIDS.indexOf(message.author.id) == -1) {
            this.error = true
            this.props.description = this.errors.botDevOnly.join("\n")
            return
        } else {
            await this.action(client, message)
        }
    }
}
