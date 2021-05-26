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
            hostname: 'mike.mymm1.com',
            port: 80,
            path: '/php/tyrantoce/tracker/wrapapi.php?game=csgo&team_id=262275',
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

                const embed = new MessageEmbed()
                    .setColor('#23dd17')
                    .setTitle('***Valorant BDE***')
                    .setURL('https://letsplay.live/team/262275/')
                    .addField('**Match:**', `**${game_details.discord.profile}** 🆚 **${game_details.discord.opponent}**`, true)
                    .addField(`${game_details.discord.starting}AEST`, `[LPL](https://letsplay.live/match/${game_details.match_id}/)`, false)
                    .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
                    .setTimestamp();

                if (new Date() > new Date(new Date(parseInt(keys[0])*1000)-3600000) && new Date() <= new Date(new Date(parseInt(keys[0])*1000)-1800000)) {
                    message.client.channels.cache.get('788021898146742295').send(embed);
                }
            }
        });
    }
}