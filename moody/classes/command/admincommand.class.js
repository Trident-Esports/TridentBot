const VillainsCommand = require('./vcommand.class');

const fs = require('fs');

/**
 * Build a Command for Admins only
 *
 * @class
 * @constructor
 * @public
 */
module.exports = class AdminCommand extends VillainsCommand {
    /**
     * @type {string[]} - List of roles as provided by server profile database file
     * @private
     */
    #ROLES; // Private: ROLES

    /**
     * constructor()
     * @param {...any} args - List of command properties from child class
     */
    constructor(...args) {
        // Create a parent object
        super(...args)

        // Disable sources for AdminCommand and children
        for (let source of ["user", "search"]) {
            if (!(this.flags)) {
                this.flags = {}
            }
            if ((!(source in this.flags)) || (this.flags[source] != "unapplicable")) {
                this.flags[source] = "invalid"
            }
        }

        // Get botdev-defined list of roles groupings
        /**
         * List of roles as provided by server profile database file
         * @type {string[]}
         * @public
         */
        this.ROLES = JSON.parse(fs.readFileSync("./dbs/roles.json", "utf8"))

        // Bail if we don't have Roles information
        if (!this.ROLES) {
            this.ROLES = { "admin": [], "mod": [], "rules": "", "member": "", "muted": "" }
            this.error = true
            this.props.description = "Failed to get Roles information."
            return
        }
    }

    /**
     * Get ROLES
     *
     * @returns {string[]} - List of saved roles
     */
    get ROLES() {
        return this.#ROLES
    }
    /**
     * Set ROLES
     *
     * @param {string[]} ROLES - List of roles to set
     */
    set ROLES(ROLES) {
        this.#ROLES = ROLES
    }

    /**
     * @param {Client} client - Discord Client object
     * @param {Message} message - Message that called the command
     */
    async build(client, message) {
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

        await this.action(client, message)
    }
}
