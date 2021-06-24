const { BaseCommand } = require('a-djs-handler');
const SlimEmbed = require('../classes/vslimbed.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEV = GLOBALS.DEV;
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))

module.exports = class KickCommand extends BaseCommand {
    constructor() {
        super({
            name: "kick",
            category: "admin",
            description: "Kick user"
        })
    }

    async run(client, message, args) {
        let props = {
            title: {},
            description: ""
        }

        let APPROVED_ROLES = ROLES["admin"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
            props.title.text = "Error"
            props.description = "Sorry, only admins can run this command. 😔"
        } else {
            //FIXME: getTarget()
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            const member = user ? message.guild.members.cache.get(user.id) : null
            if(member) {
                props.title.text = "Kick user"
                if(! DEV) {
                    member.kick()
                    props.description = `<${member}> has been kicked from the server`
                    props.image = "https://tenor.com/view/missed-kick-missed-kick-minions-fail-gif-12718518"
                } else {
                    props.description = `<${member}> *would be* kicked if this wasn't in DEV Mode`
                }
            } else {
                props.title.text = "Error"
                props.description = `User not found. '${args.join(" ")}' given.`
            }
        }

        let embed = new SlimEmbed(props)
        await message.channel.send(embed)
    }
}
