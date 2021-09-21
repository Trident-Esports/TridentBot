//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class')
const ModCommand = require('../../classes/command/modcommand.class');
const db = require('../../../models/warns')

module.exports = class ClearWarnsCommand extends ModCommand {
    constructor(client) {
        let comprops = {
            name: "removewarns",
            aliases: [
                "clearwarns",
                "clrwarns"
            ],
            group: "admin",
            memberName: "removewarns",
            description: "Clears all warns in server for user"
        }
        super(
            client,
            {...comprops}
        )
    }

    async action(client, message) {

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
                let props = { caption: { text: "Clear Warns" } }
                if (data) {
                    await db.findOneAndDelete({
                        guildID: message.guild.id,
                        user: user.id
                    })
                    props.description = `Cleared <@${user.id}>'s warns`
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
            dummy = new ClearWarnsCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
