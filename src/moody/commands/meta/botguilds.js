//@ts-check

const AdminCommand = require('../../classes/command/admincommand.class');

function ksort(obj){
  let keys = Object.keys(obj).sort(), sortedObj = {};

  for(let i in keys) {
    sortedObj[keys[i]] = obj[keys[i]];
  }

  return sortedObj;
}

module.exports = class BotGuildsCommand extends AdminCommand {
    constructor(client) {
        let comprops = {
            name: "botguilds",
            group: "meta",
            memberName: "botguilds",
            description: "List Bot Guilds",
            guildOnly: true
        }
        let props = {
            flags: {
                user: "unapplicable"
            },
            caption: {
                text: "Bot Guilds"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async action(message, args) {
        let guilds = message.client.guilds.cache
        let locale = this.inputData.args && this.inputData.args[0] ? this.inputData.args[0] : "en-AU"
        let sorted = []
        for (let [guildID, guildData] of guilds) {
            let owner = await guildData.members.fetch(guildData.ownerID)
            if (owner?.user) {
                owner = owner.user
            }
            let bot = await guildData.members.fetch(message.client.user.id)
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
                added: new Date(bot.joinedTimestamp).toLocaleString(locale)
            }
        }
        console.log("")
        console.log("---")
        console.log(`${message.client.user.username}#${message.client.user.discriminator} (ID:${message.client.user.id}) is on ${Object.keys(sorted).length} servers!`)
        this.props.description = []
        for (let [guildID, guildData] of Object.entries(ksort(sorted))) {
            console.log("---")
            console.log("Guild:",guildData.guild.name,`(ID:\`${guildData.guild.id}\`)`)
            console.log("Owner:",`\`${guildData.owner.username}#${guildData.owner.discriminator}\``,`(ID:\`${guildData.owner.id}\`)`)
            console.log("Added:",guildData.added)
            this.props.description.push(
                `**Guild:** ${guildData.guild.name} (ID:\`${guildData.guild.id}\`)`,
                `**Owner:** \`${guildData.owner.username}#${guildData.owner.discriminator}\` (ID:\`${guildData.owner.id}\`, <@${guildData.owner.id}>)`,
                `**Added:** ${guildData.added}`,
                ""
            )
        }
    }

    async test(client, message) {
        let dummy = null
        dummy = new BotGuildsCommand(client)
        dummy.run(message, [])
    }
}
