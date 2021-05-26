const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'rules role',
    aliases: ['rulesrole', 'rr'],
    description: "Sets up a rule reaction role message!",
    async execute(message, args, cmd, client, Discord) {
        const channel = '828595312981573682';
        const yellowTeamRole = message.guild.roles.cache.find(role => role.name === "Accepted Rules");

        const yellowTeamEmoji = "✅";

        let embed = new MessageEmbed()
            .setColor('#e42643')
            .setTitle('**RULES**')
            .setURL('https://discord.com/channels/788021898146742292/788576321231388704/788577576385642538')
            .setDescription('Accepting the rules will allow you to interact with the server')
            .addFields(
                {name: '***ACCEPTING RULES***', value: 'By selecting the reaction below you are agreeing to Villains Rules and will be punished according to how severly the rules are broken.'}
            )

        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(yellowTeamEmoji);

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === yellowTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(yellowTeamRole);
                }
            } else {
                return;
            }

        });

        client.on('messageReactionRemove', async (reaction, user) => {

            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;


            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === yellowTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(yellowTeamRole);
                }
            } else {
                return;
            }
        });
    }

}