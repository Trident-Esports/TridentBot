/*

Command for Mods-only

BaseCommand
 VillainsCommand
  AdminCommand
   ModCommand

*/

const AdminCommand = require('./admincommand.class');

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
        super(comprops, props)
    }

    async build(client, message) {
        let APPROVED_ROLES = this.ROLES["admin"].concat(this.ROLES["mod"])

        // Only Approved Roles
        if (!message.member.roles.cache.some(r => APPROVED_ROLES.includes(r.name))) {
            this.error = true
            this.props.description = this.errors.modOnly
            return
        }

        if (!(this.error)) {
            this.action(client, message)
        }
    }
}