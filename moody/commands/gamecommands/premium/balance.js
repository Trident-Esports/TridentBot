const GameCommand = require('../../../classes/gamecommand.class');
const VillainsEmbed = require('../../../classes/vembed.class');

module.exports = class BalanceCommand extends GameCommand {
    constructor() {
        super({
            name: 'balance',
            aliases: ['bal'],
            category: 'premium',
            description: 'Checks the Users Balance',
            extensions: [ "profile" ]
        });
    }

    async run(client, message, args) {
        let props = {
            caption: {
                text: "Balance"
            },
            title: { text: "" },
            description: "",
            footer: {
                msg: ""
            },
            players: {
                user: {},
                target: {}
            }
        }

        // TODO
        // User:    Default/Required/Optional
        // Target:  Default/Required/Optional
        // Bot:     Default/Required/Optional

        const foundHandles = await this.getArgs(
            message,
            args,
            {
                user: "default",
                target: "optional",
                bot: "invalid"
            }
        )

        const user = foundHandles.user
        const loaded = foundHandles.loaded
        props.players = foundHandles.players
        props.title = foundHandles?.title ? foundHandles.title : props.title
        props.description = foundHandles?.description ? foundHandles.description : props.description

        if (props.title.text != "Error") {
            const profileData = await this.profileModel.findOne({
                userID: loaded.id
            });

            props.description = `This is <@${loaded.id}>'s Balance`
            props.fields = [
                {
                    name: ` ${this.emojis.gold}${profileData.gold.toLocaleString("en-AU")}`,
                    value: 'Gold',
                    inline: true
                },
                {
                    name: ` ${this.emojis.bank}${profileData.bank.toLocaleString("en-AU")}`,
                    value: 'Bank',
                    inline: true
                },
                {
                    name: ` ${this.emojis.minions}${profileData.minions}`,
                    value: 'Minions',
                    inline: true
                }
            ]
        }

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}
