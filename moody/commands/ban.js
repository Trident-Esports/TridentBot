const { BaseCommand } = require('a-djs-handler');
const SlimEmbed = require('../classes/vslimbed.class');

const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEV = GLOBALS.DEV;
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))

module.exports = class BanCommand extends BaseCommand {
    constructor() {
        super({
            name: "ban",
            category: "admin",
            description: "Ban user"
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
                props.title.text = "Ban user"
                if(! DEV) {
                    member.ban()
                    props.description = `<${member}> has been Struck with the Ban Hammer`
                    props.image = "https://tenor.com/view/thor-banned-ban-hammer-thor-hammer-thor-chris-hemsworth-gif-11035060"
                } else {
                    props.description = `<${member}> *would be* banned if this wasn't in DEV Mode`
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
