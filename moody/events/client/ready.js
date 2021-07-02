const { BaseEvent } = require('a-djs-handler')
const fs = require('fs')

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready')
    }

    async run(handler) {
        let GLOBALS = JSON.parse(fs.readFileSync("./PROFILE.json","utf8"))
        let DEFAULTS = JSON.parse(fs.readFileSync("./dbs/defaults.json","utf8"))
        let DEV = GLOBALS.DEV

        let output = [
            "---",
            `${handler.client.user.username} v${DEFAULTS.VERSION} is Online!`
        ]
        if (DEV) {
            output.push(
                `!!! DEV MODE (${GLOBALS.name}) ENABLED !!!`
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
