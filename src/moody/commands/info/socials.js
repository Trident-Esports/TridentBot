const VillainsCommand = require('../../classes/vcommand.class');
const fs = require('fs');

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
            description: "Social Media Links",
        }
        super(
            {...comprops}
        )
    }

    async action(client, message) {
        const data = JSON.parse(fs.readFileSync("./dbs/" + message.guild.id + "/data.json","utf8"))
        if (data?.socials) {
            this.props.description = []
            for (let [,link] of Object.entries(data.socials)) {
                console.log(link)
                let url = link.url
                let text = link.text
                this.props.description.push(`***[${text}](${url} '${url}')***`)
            }
        }
    }
}
