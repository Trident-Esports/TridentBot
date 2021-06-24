const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('../classes/vembed.class');

module.exports = class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            category: "diagnostic",
            description: "This is a ping command"
        })
    }

    async run(client, message, args) {
        let props = {
            color:        "",
            author:       {},
            thumbnail:    "",
            title:        { text: "Pong!" },
            description:  "",
            fields:       {},
            image:        "https://media.tenor.com/images/1ddabd76ee02cff6e98e7b012243ce6a/tenor.gif",
            footer:       {},
            pages:        false
        }
        let embed = new VillainsEmbed(
            props.color,
            props.author,
            props.thumbnail,
            props.title,
            props.description,
            props.fields,
            props.image,
            props.footer,
            props.pages
        )
        await message.channel.send(embed)
    }
}
