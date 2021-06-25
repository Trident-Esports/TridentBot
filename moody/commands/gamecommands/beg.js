const {
    BaseCommand
} = require('a-djs-handler');
const GameEmbed = require('../../classes/gameembed.class');
const profileModel = require("../../../models/profileSchema");
const Levels = require('discord-xp');

module.exports = class BegCommand extends BaseCommand {
    constructor() {
        super({
            name: 'beg',
            category: 'game',
            description: 'beg for gold',
        });
    }

    async run(client, message, args) {
        let props = {
            title: {},
            description: "",
            footer: ""
        }

        const randomNumber = Math.floor(Math.random() * 50) + 1;
        const randomXP = Math.floor(Math.random() * 50) + 15;

        await profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            $inc: {
                gold: randomNumber,
            },
        });

        const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

        if (hasLeveledUP) {

            const user = await Levels.fetch(message.author.id);
            const target = message.author
            await profileModel.findOneAndUpdate({
                userID: target.id,
            }, {
                $inc: {
                    gold: 1000,
                    minions: 1
                },
            });

            let msg = `${target.username} You just Advanced to Level ${user.level}!\n
            You have gained: 💰+${gainedmoney} , 🐵+${gainedminions}`

            props.footer = msg

        }
        props.title.text = "[Beg](https://discord.com/KKYdRbZcPT)"
        props.description = `${message.author.username} recieved ${randomNumber} Gold
        Earned ${randomXP} XP`

        let begembed = new GameEmbed(props)
        await message.channel.send(begembed);
    }
}
