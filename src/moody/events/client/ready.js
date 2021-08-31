//@ts-check

const VillainsEvent = require('../../classes/event/vevent.class')
const fs = require('fs')

module.exports = class ReadyEvent extends VillainsEvent {
    constructor() {
        super('ready')
    }

    async run(handler) {
        let GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json", "utf8"))
        const PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))
        const defaults = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
        GLOBALS = (
            GLOBALS?.profile &&
            GLOBALS?.profiles &&
            GLOBALS.profile in GLOBALS.profiles
        ) ?
            GLOBALS.profiles[GLOBALS.profile]:
            defaults
        const DEV = GLOBALS?.DEV ? GLOBALS.DEV : false;

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
