//@ts-check

const AdminCommand = require('../../classes/command/admincommand.class');
const AsciiTable = require('ascii-table');

function ksort(obj){
  let keys = Object.keys(obj).sort(), sortedObj = {};

  for(let i in keys) {
    sortedObj[keys[i]] = obj[keys[i]];
  }

  return sortedObj;
}

module.exports = class BotGuildsCommand extends AdminCommand {
    constructor(context) {
        let comprops = {
            name: "botguilds",
            category: "meta",
            description: "List Bot Guilds",
            flags: {
                user: "unapplicable"
            }
        }
        let props = {
            caption: {
                text: "Bot Guilds"
            }
        }
        super(
            context,
            {...comprops},
            {...props}
        )
    }

    async action(message, args, cmd) {
        const client = message.client
        const guilds = client.guilds.cache
        const locale = this.inputData.args && this.inputData.args[0] ? this.inputData.args[0] : "en-AU"
        let sorted = []
        for (let [guildID, guildData] of guilds) {
            let owner = await guildData.members.fetch(guildData.ownerId)
            if (owner?.user) {
                owner = owner.user
            }
            let bot = await guildData.members.cache.get(client.user.id)
            sorted[bot.joinedTimestamp] = {
                guild: {
                    name: guildData.name,
                    id: guildID
                },
                owner: {
                    username: owner.username,
                    discriminator: owner.discriminator,
                    id: owner.id
                },
                added: {
                    text: new Date(bot.joinedTimestamp).toLocaleString(locale),
                    timestamp: Math.floor(bot.joinedTimestamp / 1000)
                }
            }
        }
        console.log("")
        console.log("---")
        console.log(`${client.user.username}#${client.user.discriminator} (ID:${client.user.id}) is on ${Object.keys(sorted).length} servers!`)
        this.props.description = []
        const Table = new AsciiTable("", {})
            .setHeading("Type","Name","ID")
        for (let [guildID, guildData] of Object.entries(ksort(sorted))) {
                Table.addRow("Guild",guildData.guild.name,`(ID:\'${guildData.guild.id}\')`)
                    .addRow("Owner",`\'${guildData.owner.username}#${guildData.owner.discriminator}\'`,`(ID:\'${guildData.owner.id}\')`)
                    .addRow("Added",guildData.added.text)
                    .addRow("Tier",guildData?.guild?.premiumTier ? guildData.guild.premiumTier : "???")
                    .addRow("")
            this.props.description.push(
                `**Guild:** ${guildData.guild.name} (ID:\`${guildData.guild.id}\`)`,
                `**Owner:** \`${guildData.owner.username}#${guildData.owner.discriminator}\` (ID:\`${guildData.owner.id}\`, <@${guildData.owner.id}>)`,
                `**Added:** <t:${guildData.added.timestamp}:f>`,
                `**Tier:** ${guildData?.guild?.premiumTier ? guildData.guild.premiumTier : "???"}`,
                ""
            )
        }
        console.log(Table.toString())
    }

    async test(message, args, cmd) {
        let dummy = null
        dummy = new BotGuildsCommand()
        dummy.run(message, args, cmd)
    }
}
