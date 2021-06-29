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
            title: {},
            description: "",
            footer: {
                msg: ""
            },
            players: {
                user: {},
                target: {}
            }
        }

        const user = message.author
        const target = message.mentions.members.first()
        const loaded = target ? target.user : user
        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }

        if (target?.user?.bot && target.user.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        if (props.title.text != "Error") {
            if (target) {
                props.players.target = {
                    name: target.username,
                    avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
                }
            }

            const profileData = await this.profileModel.findOne({
                userID: loaded.id
            });

            props.description = `This is <@${loaded.id}>'s Balance`
            props.fields = [
                {
                    name: ` ${this.emojis.gold}${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                    value: 'Gold',
                    inline: true
                },
                {
                    name: ` ${this.emojis.bank}${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
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
