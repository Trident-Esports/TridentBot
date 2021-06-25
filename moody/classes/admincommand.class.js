const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('./vembed.class');
const SlimEmbed = require('./vslimbed.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEFAULTS = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))

module.exports = class AdminCommand extends BaseCommand {
    constructor(comprops = {}, props = { title: {}, description: "" }) {
        super(comprops)
        this.GLOBALS = GLOBALS
        this.DEV = DEV
        this.ROLES = ROLES
        this.DEFAULTS = DEFAULTS
        this.props = props
    }

    async action(client, message, args) {
        // do nothing; command overrides this
        if(! this.DEV) {
            // do the action
        } else {
            // describe the action
        }
    }

    async build(client, message, args) {
        this.action(client, message, args)
    }

    async run(client, message, args) {
        let APPROVED_ROLES = this.ROLES["admin"]

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
