//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class SocialsCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "socials",
            aliases: [
                'facebook',
                'instagram',
                'linktree',
                'tiktok',
                'twitch',
                'twitter'
            ],
            group: "info",
            memberName: "socials",
            description: "Socials for Trident",
        }
        super(
            client,
            {...comprops}
        )
    }

    async action(client, message) {
        let url = "https://linktr.ee/TridentEsports"
        this.props.description = `***[Follow Trident Esports Socials!](${url} '${url}')***`
    }

    async test(client, message) {
        let dummy = null
        dummy = new SocialsCommand(client)
        dummy.run(message, [])
    }
}
