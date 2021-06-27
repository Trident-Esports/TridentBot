const GameCommand = require('../../../classes/gamecommand.class');
const VillainsEmbed = require('../../../classes/vembed.class');

const fs = require('fs');

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
            title: {
                text: "Balance"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        let mentionedMember = null
        if (args.length) {
            mentionedMember = message.mentions.members.first().user
        } else {
            mentionedMember = message.author
        }

        const profileData = await this.profileModel.findOne({
            userID: mentionedMember.id
        });

        let emojis = JSON.parse(fs.readFileSync("game/dbs/emojis.json", "utf8"));

        props.description = `This is ${mentionedMember}'s Balance`
        props.fields = [{
                name: ` ${emojis.gold}${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                value: 'Gold',
                inline: true
            },
            {
                name: ` ${emojis.bank}${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                value: 'Bank',
                inline: true
            },
            {
                name: ` ${emojis.minions}${profileData.minions}`,
                value: 'Minions',
                inline: true
            }
        ]
        props.thumbnail = mentionedMember.displayAvatarURL({
            dynamic: true
        })

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}
