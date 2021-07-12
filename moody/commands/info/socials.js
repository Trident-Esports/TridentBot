const VillainsCommand = require('../../classes/vcommand.class');

module.exports = class SocialsCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "socials",
            aliases: [
                'instagram',
                'twitch',
                'facebook',
                'twitter',
                'tiktok'
            ],
            category: "info",
            description: "Socials for Villains",
        }
        super(comprops)
    }

    async action(client, message) {
        let url = "https://linktr.ee/Villainsesc"
        this.props.description = `***[Follow Villains Esports Socials!](${url})***`
    }
}