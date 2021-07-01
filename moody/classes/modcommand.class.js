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
        //FIXME: Use this.getArgs(message, args, flags)
        let defaultToUser = false // true: Default to User; false: Default to Target

        /*
        User:   Invalid
        Target: Valid
        Bot:    Invalid
        */
        const user = message.author
        const target = message.mentions.members.first()

        let loaded = null
        if (defaultToUser) {
            // Default to User; use Target if Target
            loaded = target ? target.user : user
        } else {
            // Use Target
            loaded = target ? target.user : null
        }
        this.props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        // No target loaded
        if (!loaded) {
            this.props.title.text = "Error"
            this.props.description = `You need to mention a user to ${this.props.caption.text}.`
        }

        // Can't target Bot
        if (loaded?.bot && loaded.bot) {
            this.props.title.text = "Error"
            this.props.description = this.errors.cantActionBot.join("\n")
        }

        // Can't target Self
        if (loaded?.id && (loaded.id === user.id)) {
            this.props.title.text = "Error"
            this.props.description = "You can't target yourself!"
        }

        if (this.props.title.text != "Error") {
            //FIXME: Will be redundant
            if (target) {
                this.props.players.target = {
                    name: target.username,
                    avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
                }
            }

            this.action(client, message, args, loaded)
        }
    }
}
