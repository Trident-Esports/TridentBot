// @ts-nocheck

const { CommandInfo } = require('discord.js-commando');
const AdminCommand = require('./admincommand.class');
const fs = require('fs');

/**
 * @class
 * @classdesc Build a Command for Mods-only
 * @this {ModCommand}
 * @extends {AdminCommand}
 * @public
 */
module.exports = class ModCommand extends AdminCommand {
    /**
     * Constructor
     * @param {CommandInfo} comprops List of command properties from child class
     * @param {EmbedProps} props Local list of command properties
     */
    constructor(client, comprops, props) {
        // Create a parent object
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async build(client, message) {
        this.ROLES = JSON.parse(fs.readFileSync("./src/dbs/" + message.guild.id + "/roles.json", "utf8"))
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
