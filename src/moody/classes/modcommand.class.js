/*

Command for Mods-only

BaseCommand
 VillainsCommand
  AdminCommand
   ModCommand

*/
const AdminCommand = require('./admincommand.class');
const fs = require('fs');

module.exports = class ModCommand extends AdminCommand {
    /*

    constructor(comprops = {}, props = {})
    run()
     build()
      action()
     send()

    */
    constructor(comprops = {}, props = {}) {
        // Create a parent object
        super(
            {...comprops},
            {...props}
        )
    }

    async build(client, message) {
        // Get botdev-defined list of roles groupings
        this.ROLES = JSON.parse(fs.readFileSync("./dbs/" + message.guild.id + "/roles.json", "utf8"))

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
