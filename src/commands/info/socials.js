//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class SocialsCommand extends VillainsCommand {
    constructor() {
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
            category: "info",
            description: "Socials for Trident",
        }
        super(comprops)
    }

    async action(message, args, cmd) {
        let url = "https://linktr.ee/TridentEsports"
        this.props.description = `***[Follow Trident Esports Socials!](${url} '${url}')***`
    }

    async test(message, cmd) {
        let dummy = null
        dummy = new SocialsCommand()
        await dummy.run(message, [], cmd)
    }
}
