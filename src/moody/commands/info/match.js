const TeamListingCommand = require('../../classes/command/teamlistingcommand.class');

module.exports = class MatchCommand extends TeamListingCommand {
    constructor() {
        super({
            name: "match",
            category: "information",
            description: "Call single match listing"
        })
    }

    async run(client, message, args) {
        let profile = {
            "team": {}
        }
        let handlerpath = "/match/"
        let filepath = ""
        let profiles = {}
        if (args) {                             // args passed
            if (args[0]) {                      // first arg passed
                if (!isNaN(args[0])) {          // first arg is a number
                    filepath += args[0]
                    let span = "match"
                    profiles[span] = [ handlerpath + filepath + ".json" ]
                }
            } else {
                // something got stuffed up
                let msg = `${message.author}, the correct usage is:\n`
                msg += `\`${this.prefix}match <LPL matchID>\`\n`
                return message.channel.send(msg)
            }
        }

        let pages = []

        for (let [span, files] of Object.entries(profiles)) {
            for (let filepath of files) {
                let url = new URL(`http://tridentoce.mymm1.com:80${filepath}`)

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
                props.description = ""
                props.title = { text: (span.charAt(0).toUpperCase() + span.slice(1) + " Matches Schedule").trim(), url: "" }
                props.url = url.toString().includes('-') ? url.toString().substr(0,url.toString().indexOf('-')) : url
                let embed = await this.makeReq(message?.guild?.emojis, {...props}, {...params})

                pages.push(embed)
            }
        }
        super.send(message, pages, [], 0, true)
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "990184",
          "990429"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new MatchCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args)
        }
    }
}
