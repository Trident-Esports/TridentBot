const TeamListingCommand = require('../../classes/teamlistingcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');
const dasu = require('dasu');

module.exports = class LeagueCommand extends TeamListingCommand {
    constructor() {
        super(
            {
                name: "league",
                category: "information",
                description: "Call league listings"
            }
        )
    }

    async action(client, message, cmd) {
        let profile = {
            "team": {}
        }
        let handlerpath = "/league/"
        let profiles = {}
        let leagueGame = this.inputData.args[0] // valorant
        let leagueLevel = this.inputData.args[1] // challenger
        let teamID = this.inputData.args[2] // 262205

        profiles.league = [ handlerpath + leagueGame + '/' + leagueLevel + '/' + teamID + '.json' ]

        let defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json","utf8"))

        let pages = []

        for (let [span, files] of Object.entries(profiles)) {
            for (let filepath of files) {
                let url = new URL("http://villainsoce.mymm1.com:80" + filepath)

                let params = {
                    method: 'GET',
                    protocol: url.protocol,
                    hostname: url.hostname,
                    port: url.port,
                    path: url.pathname
                }

                // if (DEV) {
                //     console.log(`Fetching:${url.toString()}`)
                // }

                let props = []
                props.description = "Something got stuffed up here..."
                props.title = { text: (span.charAt(0).toUpperCase() + span.slice(1) + " Matches Schedule").trim() }
                props.url = url.toString().includes('-') ? url.toString().substr(0,url.toString().indexOf('-')) : url

                let embed = await this.makeReq(message.guild.emojis, {...props}, {...params})

                pages.push(embed)
            }
        }

        if (pages.length) {
            await this.send(message, pages, [], "", true)
            this.null = true
        }
    }
}
