const fs = require('fs');

const { Message, MessageEmbed } = require('discord.js')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: 'rules role',
    aliases: ['rulesrole', 'rr'],
    description: "Sets up a rule reaction role message!",
    async execute(message, args, cmd, client, Discord) {
        const channel = '828595312981573682';
        const rulesRole = "Accepted Rules";
        const yellowTeamRole = message.guild.roles.cache.find(role => role.name === rulesRole);

        const yellowTeamEmoji = "✅";

        let props = {
            "title": "***Rules***",
            "url": "https://discord.com/channels/788021898146742292/788576321231388704/788577576385642538"
        }

        let stripe = defaults["stripe"]
        switch (stripe) {
            default:
                stripe = "#E42643";
                break;
        }

        // Hack in my stuff to differentiate
        if (DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }

        props["stripe"] = stripe

        let embed = new MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
            .setDescription('Accepting the rules will allow you to interact with the server')
            .addField(
                '***ACCEPTING RULES***',
                'By selecting the reaction below you are agreeing to Villains Rules and will be punished according to how severely the rules are broken.'
            )

        if(DEV) {
            embed.setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();
        }

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
