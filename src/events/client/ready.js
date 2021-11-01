//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class')
const VillainsEmbed = require('../../classes/embed/vembed.class')
const VillainsEvent = require('../../classes/event/vevent.class')
const chalk = require('chalk')
const fs = require('fs')

module.exports = class ReadyEvent extends VillainsEvent {
    // ready
    constructor(context) {
        super(
            context,
            {
                once: true
            }
        )
    }

    async run() {
        const client = this.emitter
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
            console.log(chalk.red("🔴Ready Event: PROFILE manifest not found!"))
            process.exit(1)
        }
        let PACKAGE = JSON.parse(fs.readFileSync("./package.json","utf8"))
        let BRANCH = ""
        try {
            // @ts-ignore
            BRANCH = fs.readFileSync("./.git/HEAD","utf8").trim().match(/(?:\/)([^\/]*)$/)
            if (BRANCH && (BRANCH.length > 0)) {
                // @ts-ignore
                BRANCH = BRANCH[1]
            }
        } catch (err) {
            console.log(chalk.red(err))
        }

        let DEV = GLOBALS.DEV

        let props = {}

        let output = []

        if (client) {
            output.push(
                "---",
                `${client.user.username} v${PACKAGE.version} is Online!`
            )
        }
        if (DEV) {
            let profileName = `${GLOBALS.name}-<${BRANCH}>`
            if (client) {
                output.push(
                    chalk.yellow(`🟧🟧🟧 [${client.options.defaultPrefix.trim()}] DEV MODE (${profileName}) ENABLED [${client.options.defaultPrefix.trim()}] 🟧🟧🟧`)
                )
            }
        } else {
            let profileName = `<${BRANCH}>`
            if (client) {
                profileName = `${client.user.username}${profileName}`
                output.push(
                    chalk.green(`🟩🟩🟩 [${client.options.defaultPrefix.trim()}] PRODUCTION MODE (${profileName}) ENABLED [${client.options.defaultPrefix.trim()}] 🟩🟩🟩`)
                )
              }
        }
        // output.push("Mongoose warning about 'collection.ensureIndex' will be thrown.")
        output.push(
          chalk.yellow("Discord.js warning about 'message' event will be thrown."),
          chalk.green("🔱 Bot is Ready! 🔱"),
          ""
        )

        props.title = { text: output[1], url: "https://github.com/Trident-Esports/TridentBot" }
        props.description = [
            output[2].replace(
                GLOBALS.name,
                GLOBALS?.discord?.user?.id ?
                    `<@${GLOBALS.discord.user.id}>` :
                    GLOBALS.name
            )
            // .replace(/\*/g, "🟩")
            // .replace(/!/g, "🟧")
            .replace(`<${BRANCH}>`,`\`${BRANCH}\``)
            // @ts-ignore
            .replaceAll(`[${client.options.defaultPrefix.trim()}]`, `[\`${client.options.defaultPrefix.trim()}\`]`),
            output[4].replace(
                "Bot",
                `<@${client.user.id}>`
            )
        ].join("\n")

        console.log(output.join("\n"))

        let embed = null

        if (!(client)) {
            return
        }

        for (let [ guildID, guildData ] of client.guilds.cache) {
            let clientMember = await guildData.members.fetch(client.user.id)

            if (clientMember) {
                let nick = clientMember?.nickname || clientMember.user.username
                if (!(nick.includes(`[${client.options.defaultPrefix.trim()}] `))) {
                    let regexp = /^[\[\(\{]([\S]+)[\}\)\]] /
                    if (nick.match(regexp)) {
                        nick = nick.replace(regexp,`[${client.options.defaultPrefix.trim()}] `)
                    } else {
                        nick = `[${client.options.defaultPrefix.trim()}] ${nick}`
                    }
                }
                if (nick != (clientMember?.nickname || clientMember.user.username)) {
                    clientMember.setNickname(nick)
                }
            }

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