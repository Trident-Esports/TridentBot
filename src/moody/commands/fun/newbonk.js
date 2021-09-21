//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const { Client } = require('discord.js');

module.exports = class NewBonkCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "newbonk",
            group: "fun",
            memberName: "newbonk",
            description: "Bonk!",
            guildOnly: true,
            args: [
                {
                    key: "target",
                    prompt: "User to Bonk?",
                    type: "member|user"
                }
            ]
        }
        super(
            client,
            {...comprops},
            {
                flags: {
                    user: "invalid",
                    target: "required",
                    bot: "invalid"
                }
            }
        )
    }

    async action(message, args) {
        const target = args.target
        this.props.description = `<@${message.author.id}> just bonked <@${target.id}>🔨`
    }

    async run(message, args) {
        //@ts-ignore
        let client = typeof message === Client ? message : message.client

        // Process arguments
        await this.processArgs(message, args, this.flags)

        // Build the thing
        await this.build(client, message, args)

        // If we have an error, make it errortastic
        if (this.error) {
            if (this.props?.title) {
                this.props.title.text = "Error"
            } else if (this.props?.caption) {
                this.props.caption.text = "Error"
            }
        }

        const embed = new VillainsEmbed(this.props)
        return message.embed(embed)
    }
}
