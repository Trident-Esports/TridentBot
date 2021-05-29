const dasu = require('dasu');                   // HTTP requests
const { MessageEmbed } = require('discord.js'); // Discord Embeds

module.exports = {
    name: 'testing',  // Command
    aliases: [],
    permissions: [],
    description: "Checks the VALORANT BDE games", // Description of Command
    async execute(message, client, Discord) {

        let req = dasu.req  // Build a request

        let wrap = {
            "gameID": "csgo",   // GameID for WrapAPI call
            "teamID": 262275,   // LPL TeamID
            "matchID": 966389,  // LPL MatchID

            "embedColor": "#B2EE17",  // Color of line along left of embed
            "avatar": "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"  // Avatar to use as Thumbnail
        }

        let url = new URL(
            "http://villansoce.mymm1.com" + ":80" + // Host, Port
            "/team/" + wrap["teamID"] +             // Team ID
            ".json"                                 // JSON
        )
        if(wrap["matchID"]) {
            url = new URL(
                "http://villansoce.mymm1.com" + ":80" + // Host, Port
                "/match/" + wrap["teamID"] +            // Team ID
                "/" + wrap["matchID"] +                 // Match ID
                ".json"                                 // JSON
            )
        }

        let params = {
            method: 'GET',
            protocol: url["protocol"],
            hostname: url["hostname"],
            port: url["port"],
            path: url["path"] + url["hash"],
        }

        req(params, function (err, res, data) {
            let json = JSON.parse(data)

            for(let event of json["events"]) {      // Cycle through events
                let disc_summary = event["discord"] // Get the Discord object
                const embed = new MessageEmbed()    // Create an Embed
                    .setColor(wrap["embedColor"])   // Set Color of Line along Left
                    .setTitle(wrap["teamName"])     // Set Team Name
                    .setURL(disc_summary["url"])    // Set Match URL
                    .addField(                      // Home VS Opponent
                        "**Match**",
                        "**${json.team}** 🆚 **${disc_summary.opponent}",
                        true
                    )
                    .addField(                      // Match Time & URL
                        "${disc_summary.starting}",
                        "[LPL](${disc_summary.url})",
                        false
                    )
                    .setThumbnail(wrap["avatar"])   // Set Avatar
                    .setTimestamp();                // Set Timestamp
                // /embed

                message.channel.send(embed)
                    .then(
                        (sentMessage) => sentMessage.edit(
                            embed.addField(   // Edit to include Score
                                "**Score:**",
                                "${disc_summary.score.home} : ${disc_summary.score.opponent}",
                                false
                            )
                            && embed.setDescription("**This Match is Now Live!**")
                        )
                    )
                // /message
            }
        })
    }
}