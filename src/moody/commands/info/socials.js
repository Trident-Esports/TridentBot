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

    async action(message) {
        let url = "https://linktr.ee/TridentEsports"
        this.props.description = `***[Follow Trident Esports Socials!](${url} '${url}')***`
    }

    async test(message) {
        let dummy = null
        dummy = new SocialsCommand()
        dummy.run(client, message, [], null, "")
    }
}
