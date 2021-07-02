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
    constructor(comprops = {}, props = { caption: {}, title: {}, description: "", players: {} }) {
        super(comprops, props)
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

        if (!(this.error)) {
            await this.action(client, message, this.inputData.args, this.inputData.loaded)
        }
    }
}
