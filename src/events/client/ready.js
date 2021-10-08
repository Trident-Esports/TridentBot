//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class')
const VillainsEmbed = require('../../classes/embed/vembed.class')
const VillainsEvent = require('../../classes/event/vevent.class')
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
            console.log("🔴Ready Event: PROFILE manifest not found!")
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
            console.log(err)
        }

        let DEV = GLOBALS.DEV

        let props = {}

        let output = [
            "---",
            `${client.user.username} v${PACKAGE.version} is Online!`
        ]
        if (DEV) {
            let profileName = `${GLOBALS.name}-<${BRANCH}>`
            output.push(
                `🟧🟧🟧 [${client.options.defaultPrefix.trim()}] DEV MODE (${profileName}) ENABLED [${client.options.defaultPrefix.trim()}] 🟧🟧🟧`
            )
        } else {
            let profileName = `${client.user.username}-<${BRANCH}>`
            output.push(
                `🟩🟩🟩 [${client.options.defaultPrefix.trim()}] PRODUCTION MODE (${profileName}) ENABLED [${client.options.defaultPrefix.trim()}] 🟩🟩🟩`
            )
        }
        // output.push("Mongoose warning about 'collection.ensureIndex' will be thrown.")
        output.push("Discord.js warning about 'message' event will be thrown.")
        output.push("🔱 Bot is Ready! 🔱")
        output.push("")

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
        for (let [ guildID, guildData ] of client.guilds.cache) {
            let clientMember = await guildData.members.fetch(client.user.id)

            if (clientMember) {
                let nick = clientMember?.nickname || clientMember.user.username
                if (!(nick.includes(`[${client.options.defaultPrefix.trim()}]`))) {
                    nick = `[${client.options.defaultPrefix.trim()}] ${nick}`
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
