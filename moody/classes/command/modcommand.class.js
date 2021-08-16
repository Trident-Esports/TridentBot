const AdminCommand = require('./admincommand.class');

/**
 * Build a Command for Mods only
 *
 * @class
 * @constructor
 * @public
 */
module.exports = class ModCommand extends AdminCommand {
    /**
     *
     * @param {Object.<string, any>} comprops - List of command properties from child class
     * @param {Object.<string, any>} props - Local list of command properties
     */
    constructor(comprops = {}, props = {}) {
        // Create a parent object
        super(
            {...comprops},
            {...props}
        )
    }

    /**
     * Build pre-flight characteristics of AdminCommand
     *
     * @param {Client} client - Discord Client object
     * @param {Message} message - Message that called the command
     */
    async build(client, message) {
        let APPROVED_ROLES = this.ROLES["admin"].concat(this.ROLES["mod"])

        // Bail if member doesn't have Approved Roles
        if (!message.member.roles.cache.some(r => APPROVED_ROLES.includes(r.name))) {
            this.error = true
            this.props.description = this.errors.modOnly
            return
        }

        this.action(client, message)
    }
}
