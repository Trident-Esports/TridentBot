//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const chalk = require('chalk');
const dasu = require('dasu');

module.exports = class BallChasingReplaysCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "bcreplays",
            category: "info",
            description: "BallChasing Replays"
        }
        super(
            {...comprops}
        )
    }

    async action(message, args, cmd) {
        let urlStr = "https://ballchasing.com:443/api" + '/replays?moo=cow'

        const query = {
            "player-id": [
                "steam:76561198811623052",  // RoToR
                "steam:76561198310427699",  // Smash
                "steam:76561198360762341"   // Viictus
            ],
            "season": "f4",
            "sort-by": "replay-date",
            "count": 5
        }

        for(let [k,v] of Object.entries(query)) {
            if(typeof v == "object") {
                for(let val of v) {
                    urlStr += `&${k}=${val}`
                }
            } else {
                urlStr += `&${k}=${v}`
            }
        }

        const url = new URL(urlStr)

        let params = {
            method: 'GET',
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            headers: {
                "Authorization": process.env.ballchasing_apiKey
            }
        }

        const req = dasu.req

        await req(params, async function(err, res, data) {
            try {
                let json = JSON.parse(data)
                for (const [, match] of Object.entries(json.list)) {
                    console.log(match.replay_title)
                    console.log(match.link.replace("/api/replays/","/replay/"))
                    console.log(`🟦 ${match.blue.goals} - ${match.orange.goals} 🟧`)
                    for (const team of ["blue", "orange"]) {
                        console.log(
                            (team == "blue" ? "🟦" : "🟧") + " " +
                            `${match[team].name || (`Team ${team.charAt(0).toUpperCase() + team.slice(1)}`)}: ` +
                            `${match[team].players.map(player => player.name.replace('.',''))
                                .sort(
                                    function(a, b) {
                                        let nameA = a.toUpperCase()
                                        let nameB = b.toUpperCase()
                                        if (nameA < nameB) return -1
                                        if (nameA > nameB) return 1
                                        return 0
                                    }
                                ).join(", ")}`
                        )
                    }
                    console.log()
                }
            } catch (e) {
                // console.log(chalk.red(e))
                // console.log(chalk.red(data))
            }
        })
    }

    async test(message, cmd) {
        this.run(message, [], cmd)
    }
}
