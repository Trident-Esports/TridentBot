// @ts-check

const VillainsCommand = require('./vcommand.class');
const { CommandInfo } = require('discord.js-commando');

const fs = require('fs');

/**
 * @class
 * @classdesc Build a Command for Admins-only
 * @this {AdminCommand}
 * @extends {VillainsCommand}
 * @public
 */
module.exports = class AdminCommand extends VillainsCommand {
    /**
     * @type {Array.<string>} List of roles as provided by server profile database file
     * @private
     */
    #ROLES; // Private: ROLES

    /**
     * Constructor
     * @param {CommandInfo} comprops  List of command properties from child class
     */
    constructor(client, comprops, props) {
        // Create a parent object
        super(
            client,
            {...comprops}
        )

        this.flags = props?.flags ? props.flags : {}

        // Disable sources for AdminCommand and children
        for (let source of ["user", "search"]) {
            if ((!(source in this.flags)) || (this.flags[source] != "unapplicable")) {
                this.flags[source] = "invalid"
            }
        }

        // Get botdev-defined list of roles groupings
        /**
         * List of roles as provided by server profile database file
         * @type {Object.<[x:string], Array.<string>>}
         * @public
         */
        this.ROLES = {} // populate in build()
    }

    /**
     * Get ROLES
     *
     * @returns {Object.<[x:string], Array.<string>>} List of saved roles
     */
    get ROLES() {
        return this.#ROLES
    }
    /**
     * Set ROLES
     *
     * @param {Object.<[x:string], Array.<string>>} ROLES List of roles to set
     */
    set ROLES(ROLES) {
        this.#ROLES = ROLES
    }

    async build(client, message) {
        if (message) {
            this.ROLES = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/roles.json", "utf8"))
            let APPROVED_ROLES = this.ROLES["admin"]
            // Bail if we don't have intended Approved Roles data
            if (!APPROVED_ROLES) {
                this.error = true
                this.props.description = "Failed to get Approved Roles."
                return
            }

            // Bail if member doesn't have Approved Roles
            if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
                this.error = true
                this.props.description = this.errors.adminOnly
                return
            }
        }

        await this.action(client, message)
    }
}
