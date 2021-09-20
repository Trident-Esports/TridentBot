//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class ReadyEvent extends VillainsEvent {
    constructor() {
        super('ready')
    }

    async run(client) {
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

        let output = [
            "---",
            `${client.user.username} v${PACKAGE.version} is Online!`
        ]
        if (DEV) {
            output.push(
                `!!! DEV MODE (${GLOBALS.name}) ENABLED !!!`
            )
        } else {
            output.push(
                `\*\*\* PRODUCTION MODE (${client.user.username}) ENABLED \*\*\*`
            )
        }
        output.push(
            "Mongoose warning about collection.ensureIndex will be thrown.",
            "Bot is Ready!",
            ""
        )
        console.log(output.join("\n"))
    }
}
