//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class ReadyEvent extends VillainsEvent {
    constructor() {
        super('ready')
    }

    async run(handler) {
        let GLOBALS = null
        try {
            GLOBALS = JSON.parse(fs.readFileSync("./src/PROFILE.json", "utf8"))
        } catch(err) {
            console.log("Ready Event: PROFILE manifest not found!")
            process.exit(1)
        }
        let PACKAGE = JSON.parse(fs.readFileSync("./package.json","utf8"))
        let DEV = GLOBALS.DEV

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
        output.push(
            "Mongoose warning about collection.ensureIndex will be thrown.",
            "Ready!",
            ""
        )
        console.log(output.join("\n"))
    }
}
