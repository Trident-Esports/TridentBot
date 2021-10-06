//@ts-check

const VillainsEmbed = require('../../classes/embed/vembed.class')
const VillainsEvent = require('../../classes/event/vevent.class')
const VillainsCommand = require('../../classes/command/vcommand.class')
const fs = require('fs')

module.exports = class ReadyEvent extends VillainsEvent {
    constructor() {
        super('ready')
    }

    async run(handler) {
        let GLOBALS = null
        const defaults = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"))
        try {
            GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
            GLOBALS = (
                GLOBALS?.profile &&
                GLOBALS?.profiles &&
                GLOBALS.profile in GLOBALS.profiles
            ) ?
                GLOBALS.profiles[GLOBALS.profile]:
                defaults
        } catch(err) {
            console.log("Ready Event: PROFILE manifest not found!")
            process.exit(1)
        }
        let PACKAGE = JSON.parse(fs.readFileSync("./package.json","utf8"))
        let DEV = GLOBALS.DEV

        let props = {}

        let output = [
            "---",
            `${handler.client.user.username} v${PACKAGE.version} is Online!`
        ]
        if (DEV) {
            output.push(
                `!!! DEV MODE (${GLOBALS.name}) ENABLED !!!`
            )
        } else {
            output.push(
                `\*\*\* PRODUCTION MODE (${handler.client.user.username}) ENABLED \*\*\*`
            )
        }
        output.push("Mongoose warning about collection.ensureIndex will be thrown.")
        output.push("Bot is Ready!")
        output.push("")

        props.title = { text: output[1], url: "https://github.com/Trident-Esports/TridentBot" }
        props.description = [
            output[2].replace(
                GLOBALS.name,
                GLOBALS?.discord?.user?.id ?
                    `<@${GLOBALS.discord.user.id}>` :
                    GLOBALS.name
            )
            .replace(/\*/g, "🟩")
            .replace(/!/g, "🟧"),
            output[4].replace(
                "Bot",
                `<@${handler.client.user.id}>`
            )
        ].join("\n")

        console.log(output.join("\n"))

        let embed = null
        for (let [ guildID, guildData ] of handler.client.guilds.cache) {
            let dummyMsg = { "guild": guildData }
            const channel = await this.getChannel(dummyMsg, "bot-console")
            if (channel) {
                dummyMsg.channel = channel
                embed = new VillainsEmbed(props)
                let vCommand = new VillainsCommand({ name: "botready"}, { channel: channel })

                if ((!(DEV)) || guildID == "745409743593406634" || false) {
                    let message = vCommand.send(dummyMsg, embed)
                }
            }
        }
    }
}
