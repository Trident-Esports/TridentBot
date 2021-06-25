const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

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
            title: { text: "Beg" },
            description: "",
            footer: { msg: "" }
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

        const hasLeveledUP = await this.Levels.appendXp(message.author.id, message.guild.id, randomXP);

        if (hasLeveledUP) {

            const user = await this.Levels.fetch(message.author.id, message.guild.id);
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
                `You have gained: 💰${gainedmoney.toLocaleString()}, 🐵${gainedminions.toLocaleString()}`
            ].join(" · ")

            props.footer.msg = msg
        }
        props.thumbnail = message.author.avatarURL({ dynamic: true })
        props.description = `*${message.author} begs...*`
        props.fields = [
            {
                name: `💰${randomNumber.toLocaleString()}`,
                value: "Gold",
                inline: true
            },
            {
                name: `✨${randomXP.toLocaleString()}`,
                value: "XP",
                inline: true
            }
        ]

        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}
