//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const dasu = require('dasu');

module.exports = class BallChasingPingCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "bcping",
            category: "info",
            description: "BallChasing Ping"
        }
        super(
            {...comprops}
        )
    }

    async action(message, args, cmd) {
        let pages = []

        let req = dasu.req

        const url = new URL("https://ballchasing.com:443/api" + '/')

        let params = {
            method: 'GET',
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            headers: {
                "Authorization": process.env.ballchasing_apiKey
            }
        }

        let props = {
            title: { text: "Pong!" },
            description: "",
            image: "https://thumbs.gfycat.com/CreativeSafeGrayreefshark-size_restricted.gif"
        }
        let embed = new VillainsEmbed(props)

        await req(params, async function(err, res, data) {
            try {
                let json = JSON.parse(data)

                for (let [name, value] of Object.entries(json.chat)) {
                    embed.addField(name, value, true)
                }
            } catch (e) {
                console.log("BallChasing Ping Error")
                console.log(e)
                console.log(data)
            }
        });
        pages.push(embed)
        super.send(message, pages)
        this.null = true
    }

    async test(message, cmd) {
        this.run(message, [], cmd)
    }
}
