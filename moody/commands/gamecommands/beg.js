const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class BegCommand extends GameCommand {
    constructor() {
        super({
            name: 'beg',
            category: 'game',
            description: 'beg for gold',
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Beg"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        const randomNumber = Math.floor(Math.random() * 50) + 1;
        const randomXP = Math.floor(Math.random() * 50) + 15;

        let inc = {
            gold: randomNumber
        }
        await this.profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            $inc: inc,
        });

        let emojis = JSON.parse(fs.readFileSync("game/dbs/emojis.json", "utf8"));

        const hasLeveledUP = await this.Levels.appendXp(message.author.id, randomXP);

        if (hasLeveledUP) {

            const user = await this.Levels.fetch(message.author.id);
            const target = message.author
            let gainedmoney = 1000
            let gainedminions = 1
            let inc = {
                gold: gainedmoney,
                minions: gainedminions
            }
            await this.profileModel.findOneAndUpdate({
                userID: target.id,
            }, {
                $inc: inc,
            });

            let msg = [
                `You just Advanced to Level ${user.level.toLocaleString()}!`,
                `You have gained: ${emojis.gold}${gainedmoney.toLocaleString()}, ${emojis.minions}${gainedminions.toLocaleString()}`
            ].join(" · ")

            props.footer.msg = msg
        }
        props.thumbnail = message.author.avatarURL({
            dynamic: true
        })
        props.description = `*${message.author} begs...*`
        props.fields = [{
                name: `${emojis.gold}${randomNumber.toLocaleString()}`,
                value: "Gold",
                inline: true
            },
            {
                name: `${emojis.xp}${randomXP.toLocaleString()}`,
                value: "XP",
                inline: true
            }
        ]

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}