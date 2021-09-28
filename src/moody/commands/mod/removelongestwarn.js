//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class');
const ModCommand = require('../../classes/command/modcommand.class');
const db = require('../../../models/warns');

module.exports = class RemoveLongestWarnCommand extends ModCommand {
    constructor(client) {
        let comprops = {
            name: "removelongestwarn",
            aliases: [
                'rmvlongestwarn',
                'rmvlngstwrn'
            ],
            group: "mod",
            memberName: "removelongestwarn",
            description: "Warns user",
            guildOnly: true,
            clientPermissions: [
                "KICK_MEMBERS"
            ],
            userPermissions: [
                "KICK_MEMBERS"
            ]

        }
        super(
            client,
            //@ts-ignore
            {...comprops}
        )
    }

    async action(client, message, args) {

        const user = this.inputData.loaded

        if (!user) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
        }

        if(!(this.error)) {
            db.findOne({
                guildID: message.guild.id,
                user: user.id
            }, async (err, data) => {
                if (err) throw err;
                let props = {}
                if (data) {
                    props.description = `Deleted <@${user.id}>'s last warn`
                    data.content.splice(0, 1)
                    data.save()
                } else {
                    props.error = true
                    props.description = `<@${user.id}> has no warns!`
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
          message.author.username,
          message.author.id,
          client.user.username,
          "Wanrae"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new RemoveLongestWarnCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
