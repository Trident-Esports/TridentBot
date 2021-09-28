//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class')
const ModCommand = require('../../classes/command/modcommand.class');
const db = require('../../../models/warns')

module.exports = class ClearWarnsCommand extends ModCommand {
    constructor(client) {
        let comprops = {
            name: "clearwarns",
            aliases: [
                "removewarns",
                "clrwarns"
            ],
            group: "mod",
            memberName: "clearwarns",
            description: "Clears all warns in server for user",
            guildOnly: true,
            clientPermissions: [
                "KICK_MEMBERS"
            ],
            userPermissions: [
                "KICK_MEMBERS"
            ],
            args: [
                {
                    key: "target",
                    prompt: "User to clear warns for?",
                    type: "member|user"
                }
            ]
        }
        super(
            client,
            //@ts-ignore
            {...comprops},
            {
                description: ""
            }
        )
    }

    async action(message, args) {

        let target = args.target
        console.log(`Target In: ${target.displayName} (ID:${target.id})`)
        console.log(JSON.stringify(target))
        console.log(`ID:      ${target.id}`)
        console.log(`?.ID:    ${target?.id}`)
        console.log(`!?.ID:   ${!target?.id}`)
        console.log(`!(?.ID): ${!(target?.id)}`)

        if (!(target?.id)) {
            console.log(`No Target ID`)
            target = await message.guild.members.find(
                (user) =>
                    (user?.id     === target) ||
                    (user?.userID === target) ||
                    (user?.name   === target) ||
                    false
            )
            console.log(`Searched and got: ${target}`)
            if(target?.user) {
                target = target.user
                console.log(`User: ${target}`)
            }
        }

        if (!(target?.id)) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
            return
        }

        if(!(this.error)) {
            db.findOne({
                guildID: message.guild.id,
                user: target.id
            }, async (err, data) => {
                if (err) throw err;
                let props = { caption: { text: "Clear Warns" } }
                if (data) {
                    await db.findOneAndDelete({
                        guildID: message.guild.id,
                        user: target.id
                    })
                    props.description = `Cleared <@${target.id}>'s warns`
                } else {
                    props.error = true
                    props.description = `<@${target.id}> has no warns!`
                }
                let embed = new VillainsEmbed(props)
                // message.channel.send({ embeds: [embed] }) // discord.js v13
                message.channel.send(embed)
            })
            this.null = true
        }
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          { target: message.author.username },
          { target: message.author.id },
          { target: client.user.username },
          { target: "Wanrae" }
        ]

        for(let added of varArgs) {
            let args = added
            dummy = new ClearWarnsCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
