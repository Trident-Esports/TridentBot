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
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEFAULTS = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))

module.exports = class AdminCommand extends VillainsCommand {
    /*

    constructor(comprops = {}, props = {})
    run()
     build()
      action()
     send()

    */
    constructor(comprops = {}, props = { caption: {}, title: {}, description: "", players: {} }) {
        // Create a parent object
        super(comprops)

        // Get settings
        this.GLOBALS = GLOBALS
        this.DEV = DEV
        this.ROLES = ROLES
        this.DEFAULTS = DEFAULTS

        // Default a title
        if (!(props?.caption?.text)) {
            if (!(props?.caption)) {
                props.caption = {}
            }
            props.caption.text = this.name.charAt(0).toUpperCase() + this.name.slice(1)
        }

        // Set props
        this.props = props

        // Set error messages
        this.errors = JSON.parse(fs.readFileSync("game/dbs/errors.json", "utf8"))
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
        const user = message.author
        this.props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        this.action(client, message, args)
    }

    // Run the command
    async run(client, message, args) {
        let APPROVED_ROLES = this.ROLES["admin"]

        // Only Approved Roles
        //FIXME: Move error message to this.errors
        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
            this.props.title.text = "Error"
            this.props.description = "Sorry, only admins can run this command. 😔"
        } else {
            this.build(client, message, args)
        }

        let embed = null
        if(this.props?.full && this.props.full) {
            embed = new VillainsEmbed(this.props)
        } else {
            embed = new SlimEmbed(this.props)
        }
        await message.channel.send(embed)
    }
}
