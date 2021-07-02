/*

Command for Admins-only

BaseCommand
 VillainsCommand
  AdminCommand

*/
const VillainsCommand = require('./vcommand.class');
const VillainsEmbed = require('./vembed.class');
const SlimEmbed = require('./vslimbed.class');

const fs = require('fs');

module.exports = class AdminCommand extends VillainsCommand {
    #ROLES; // Private: ROLES

    /*

    constructor(comprops = {}, props = {})
    run()
     build()
      action()
     send()

    */
    constructor(comprops = {}, props = { caption: {}, title: {}, description: "", players: {} }) {
        // Create a parent object
        super(comprops, props)

        this.ROLES = JSON.parse(fs.readFileSync("./dbs/roles.json", "utf8"))
    }

    get ROLES() {
        return this.#ROLES
    }
    set ROLES(ROLES) {
        this.#ROLES = ROLES
    }

    async action(client, message, args) {
        // do nothing; command overrides this
        if(! this.DEV) {
            // Do the thing
        } else {
            // Describe the thing
        }
    }

    async build(client, message, args) {
        /*

        Start Setup

        */
        // Use target flags conditionally based on used command
        await this.processArgs(
            message,
            args,
            {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        )
        /*

        End Setup

        */

        let APPROVED_ROLES = this.ROLES["admin"]

        // Only Approved Roles
        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
            this.error = true
            this.props.description = this.errors.adminOnly
        }

        if(!(this.error)) {
            this.action(client, message, this.inputData.args, this.inputData.loaded)
        }
    }

    // Run the command
    async run(client, message, args) {
        await this.build(client, message, args)

        let embed = null
        if(this.props?.full && this.props.full) {
            embed = new VillainsEmbed(this.props)
        } else {
            embed = new SlimEmbed(this.props)
        }

        await this.send(message, embed)
    }
}
