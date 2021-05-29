const dasu = require('dasu');
const { MessageEmbed, Message } = require('discord.js');

module.exports =  {
    name: 'games',
    aliases: [],
    permissions: [],
    description: "Checks the valorant bde games",

    async execute(message, client, Discord) {

        var req = dasu.req

        var params = {
            method: 'GET',
            protocol: 'http',
            hostname: 'villainsoce.mymm1.com',
            port: 80,
            path: '/team/262275.json',
        }

        req(params, function (err, res, data) {
            var json = JSON.parse(data)
            var game_details = (json["events"])
            var keys = [];
            var useKey;
            for (var key in game_details) {
                keys.push(key);
            }
            try{
                while (new Date(parseInt(keys[0])*1000) < new Date()) {
                    keys = keys.slice(1, keys.length);
                }
            } catch (err) {
                console.log(err);
            } finally {
                useKey = parseInt(keys[0]);
                var game_details = (json["events"][useKey])

                let props = {
                    "embedColor": "#B2EE17",
                    "title": "***" + json["team"] + "***",
                    "url": json["team_url"],
                    "thumbnail": "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"
                }
                let channelNames = {
                    "general": "788021898146742295"
                }
                let footer = {
                    "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
                    "msg": "This bot was Created by Noongar1800#1800"
                }
                let starting_time = new Date(game_details.discord.timestampMS)

                const embed = new MessageEmbed()
                    .setColor(props["embedColor"])
                    .setTitle(props["title"])
                    .setURL(props["url"])
                    .addField('**Match:**', `**${game_details.discord.profile}** 🆚 **${game_details.discord.opponent}**`, true)
                    .addField(`${starting_time}AEST`, `[LPL](https://letsplay.live/match/${game_details.match_id}/)`, false)
                    .setThumbnail(props["thumbnail"])
                    .setTimestamp();

                    message.channel.send(embed);
                //if (new Date() > new Date(new Date(parseInt(keys[0])*1000)-3600000) && new Date() <= new Date(new Date(parseInt(keys[0])*1000)-1800000)) {
                //    message.client.channels.cache.get(channelNames["general"]).send(embed);
                //} 
                
                //This sends to general an hour before the game
            }
        });
    } //FIX ME
}
