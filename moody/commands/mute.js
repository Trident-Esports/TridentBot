const { BaseCommand } = require('a-djs-handler');
const SlimEmbed = require('../classes/vslimbed.class');

const fs = require('fs');
const ms = require('ms');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let DEV = GLOBALS.DEV;
let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))

module.exports = class MuteCommand extends BaseCommand {
    constructor() {
        super({
            name: "mute",
            aliases: [ "silence" ],
            category: "admin",
            description: "Mute user"
        })
    }

    async run(client, message, args) {
        let props = {
            title: {},
            description: ""
        }

        let APPROVED_ROLES = ROLES["admin"]
        let MEMBER_ROLE = ROLES["member"]
        let MUTED_ROLE = ROLES["muted"]

        if(!message.member.roles.cache.some(r=>APPROVED_ROLES.includes(r.name)) ) {
            props.title.text = "Error"
            props.description = "Sorry, only admins can run this command. 😔"
        } else {
            //FIXME: getTarget()
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            const member = user ? message.guild.members.cache.get(user.id) : null
            if(member) {
                props.title.text = "Mute user"
                if(! DEV) {
                    let mainRole = message.guild.roles.cache.find(role => role.name === MEMBER_ROLE);
                    let muteRole = message.guild.roles.cache.find(role => role.name === MUTED_ROLE);
                    member.roles.remove(mainRole.id)
                    member.roles.add(muteRole.id)
                    props.description = `<${member}> has been muted`
                    let duration = args[1] ? args[1] : 0
                    if(duration > 0) {
                        props.description += ` for ${ms(ms(duration))}`
                    }
                    props.image = "https://tenor.com/view/ash-mute-pokemon-role-muted-gif-12700315"
                    setTimeout(function() {
                        member.roles.remove(muteRole.id)
                        member.roles.add(mainRole.id)
                    }, ms(duration))
                } else {
                    props.description = `<${member}> *would be* muted if this wasn't in DEV Mode`
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
