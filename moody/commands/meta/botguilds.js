const AdminCommand = require('../../classes/admincommand.class');

function ksort(obj){
  var keys = Object.keys(obj).sort()
    , sortedObj = {};

  for(var i in keys) {
    sortedObj[keys[i]] = obj[keys[i]];
  }

  return sortedObj;
}

module.exports = class BotGuildsCommand extends AdminCommand {
    constructor() {
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
        super(comprops, props)
    }

    async action(client, message) {
        let guilds = client.guilds.cache
        let locale = this.inputData.args && this.inputData.args[0] ? this.inputData.args[0] : "en-AU"
        let sorted = []
        for (let [guildID, guildData] of guilds) {
            let owner = guildData.members.cache.get(guildData.ownerID).user
            let bot = guildData.members.cache.get(client.user.id)
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
        console.log(`${client.user.username}#${client.user.discriminator} (ID:${client.user.id}) is on ${Object.keys(sorted).length} servers!`)
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
}
