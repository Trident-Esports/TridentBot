const TridentSlimbed = require('../embed/vslimbed.class');
const TridentEmbed = require('../embed/vembed.class');
const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class TridentCommand extends Command {
    constructor(client, comprops, props) {
        super(
            client,
            {...comprops}
        )

        this.props = {...props}

        if(!(this?.props?.full)) {
            this.props.full = true
        }
        if(!(this?.props?.description) || (this?.props?.description.trim() == "")) {
            this.props.description = ""
        }
        if(this?.props?.null) {
            this.null = true
        }

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
            console.log("VCommand: PROFILE manifest not found!")
            process.exit(1)
        }
        this.DEV = GLOBALS.DEV
    }

    async processArgs(msg, args, flags) {
        // get new args
    }

    async action() {
        if(this.DEV) {
        } else {
        }
    }

    async build(msg, args) {
        if(!(this.error)) {
            await this.action(msg, args)
        }
    }

    async run(msg, args) {
        await this.processArgs(msg, args, this.flags)
        await this.build(msg, args)
        let page = null
        if(this.props?.full && this.props.full) {
            page = new TridentEmbed({...this.props})
        } else {
            page = new TridentSlimbed({...this.props})
        }

        await msg.embed(page)
    }
}
