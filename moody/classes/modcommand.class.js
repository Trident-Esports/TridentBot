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
        User:   Invalid
        Target: Valid
        Bot:    Invalid
        */
        /*

        Start Setup

        */
        // Use target flags conditionally based on used command
        const foundHandles = await this.getArgs(
            message,
            args,
            {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        )

        const user = foundHandles.user
        const loaded = foundHandles.loaded
        this.props.players = foundHandles.players
        this.props.title = foundHandles?.title ? foundHandles.title : this.props.title
        this.props.description = foundHandles?.description ? foundHandles.description : this.props.description
        /*

        End Setup

        */

        if (this.props.title.text != "Error") {
            this.action(client, message, args, loaded)
        }
    }
}
