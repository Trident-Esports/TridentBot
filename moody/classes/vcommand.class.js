const { BaseCommand } = require('a-djs-handler');
const pagination = require('discord.js-pagination');

const fs = require('fs');

module.exports = class VillainsCommand extends BaseCommand {
    constructor(comprops = {}, props = { caption: {}, title: {}, description: "", players: {} }) {
        super(comprops)
        if (!(props?.caption?.text)) {
            if (!(props?.caption)) {
                props.caption = {}
            }
            props.caption.text = this.name.charAt(0).toUpperCase() + this.name.slice(1)
        }
        this.props = props
        this.errors = JSON.parse(fs.readFileSync("game/dbs/errors.json", "utf8"))
    }

    async send(message, pages, emoji = ["◀️", "▶️"], timeout = "600000", forcepages = false) {
        if (forcepages) {
            emoji = ["◀️", "▶️"]
            timeout = "600000"
        }
        if (Array.isArray(pages)) {
            if ((pages.length <= 1) && !forcepages) {
                message.channel.send(pages[0])
            } else {
                let filler = "🤡"
                if (emoji.length !== 2) {
                    if (emoji.length == 1) {
                        emoji.push(filler)
                    } else if (emoji.length >= 3) {
                        emoji = emoji.slice(0,2)
                    }
                }
                if (emoji[0] == emoji[1]) {
                    emoji = emoji.slice(0,1)
                    emoji.push(filler)
                }
                await pagination(message, pages, emoji, timeout)
            }
        } else {
            message.channel.send(pages)
        }
    }
}
