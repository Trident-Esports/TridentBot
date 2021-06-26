const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class DailyCommand extends GameCommand {
    constructor() {
        super({
            name: 'daily',
            category: 'game',
            description: 'Gain some Gold',
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Daily"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        const randomNumber = Math.floor(Math.random() * 0) + 30000;

        let inc = {
            gold: randomNumber
        }
        await this.profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            $inc: inc,
        });

        props.thumbnail = message.author.avatarURL({
            dynamic: true
        })
        props.description = `${message.author} has checked into the Lair for the Day.
        
        Collected ${randomNumber.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Gold`
        
        let embed = new VillainsEmbed(props)
        await message.channel.send(embed);
    }
}