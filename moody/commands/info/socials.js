const VillainsCommand = require('../../classes/vcommand.class');

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
            description: "Socials for Villains",
        }
        super(comprops)
    }

    async action(client, message) {
        let url = "https://linktr.ee/Villainsesc"
        this.props.description = `***[Follow Villains Esports Socials!](${url} '${url}')***`
    }
}
