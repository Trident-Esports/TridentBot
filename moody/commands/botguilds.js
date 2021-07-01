const AdminCommand = require('../classes/admincommand.class');
const VillainsEmbed = require('../classes/vembed.class');

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
        super({
            name: "botguilds",
            category: "meta",
            description: "List Bot Guilds"
        })
    }

    async run(client, message, args) {
        let guilds = client.guilds.cache
        let locale = args && args[0] ? args[0] : "en-AU"
        let sorted = []
        for (let [guildID, guildData] of guilds) {
            let owner = guildData.members.cache.get(guildData.ownerID).user
            let bot = guildData.members.cache.get(client.user.id)
            sorted[bot.joinedTimestamp] = {
                guild: `${guildData.name} (ID:${guildID})`,
                owner: `${owner.username}#${owner.discriminator} (ID:${owner.id})`,
                added: new Date(bot.joinedTimestamp).toLocaleString(locale)
            }
        }
        console.log("")
        console.log("---")
        console.log(`${client.user.username}#${client.user.discriminator} (ID:${client.user.id}) is on ${Object.keys(sorted).length} servers!`)
        for (let [guildID, guildData] of Object.entries(ksort(sorted))) {
            console.log("---")
            console.log("Guild:",guildData.guild)
            console.log("Owner:",guildData.owner)
            console.log("Added:",guildData.added)
        }
    }
}
