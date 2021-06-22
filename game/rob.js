const { MessageEmbed } = require('discord.js');
const profileModel = require("../models/profileSchema");

const Levels = require('discord-xp');

module.exports = {
    name: 'rob',
    aliases: [],
    description: 'Rob SomeOne For Money', // Optional
    cooldown: 60 * 30,

    async execute(message, profileData) {

        const randomXP = Math.floor(Math.random() * 120) + 30;
        const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

        const user = message.author
        const mention = message.mentions.members.first();
        if (!mention) {
            this.cooldown = 0;
            return message.reply('Whom Do You Want Rob?');
        }
        if (user.id === mention.id) {
            this.cooldown = 0;
            return message.reply("You can't rob yourself dummy");
        }
        const usermoney = profileModel.findOne({ userID: user.id, gold: profileData.gold }) // Same As balance.js // Get User Money
        const mentionmoney = profileModel.findOne({ userID: mention.id, gold: profileData.gold }) // Same As balance.js // Get Mentioned User Money

        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min
        }

        let options = [
            'Success',
            'Failed',
            'Paid'
        ]
        let robbed = random(0, parseInt(options.length))
        let final = options[robbed]

        if (usermoney < 500) return message.send(`You Need Atleast $500 In Your Wallet To Rob Someone`); // If User Money In Wallet Is Less Then 2000
        if (mentionmoney < 500) return message.send(`Mentioned User Should Have Atleast $500 In Wallet To Rob`); // If Mentioned User Money In Wallet Is Less Then 2000


        else {
            try {
                let sendEmbed = new MessageEmbed()
                    .setTimestamp()
                    .setColor("RANDOM")
                if (final === 'Success') {

                    const amount = Math.floor(Math.random() * 1400) + 100 // Min Is 100 And Max Is 1500(100+1400)

                    if (mentionmoney.gold < amount) {
                        let(amount === mentionmoney.gold)
                    }

                    sendEmbed.setAuthor(`Holding your hostage at Gunpoint.`, user.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You try to rob them.`)
                        .setDescription(`<@${user.id}> Robbed <@${mention.id}> And Got Away With **$${amount}**\nEarned ${randomXP} XP`)

                    await profileModel.findOneAndUpdate(
                        {
                            userID: user.id
                        },
                        {
                            $inc: {
                                gold: amount,
                            },
                        }); // Add Money To User's Wallet
                    await profileModel.findOneAndUpdate(
                        {
                            userID: mention.id
                        },
                        {
                            $inc: {
                                gold: -amount,
                            },
                        });// Substract Money From Mention(Robbed) User's Wallet
                }
                else if (final === 'Failed') {
                    sendEmbed.setAuthor(`Holding your hostage at Gunpoint.`, user.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You try to rob them.`)
                        .setDescription(`<@${user.id}> tried To Rob <@${mention.id}>. You realise they are poor.\nEarned ${randomXP} XP`)
                }
                else if (final === 'Paid') {

                    const amount = Math.floor(Math.random() * 1400) + 100 // Min Is 100 And Max Is 1500(100+1400)

                    sendEmbed.setAuthor(`Holding your hostage at Gunpoint.`, user.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You try to rob them.`)
                        .setDescription(`<@${user.id}> tried to rob <@${mention.id}>. You were Caught and instead <@${mention.id}> stole your gun and robbed you of **$${amount}**.\nWHAT A FAIL!\n\n<@${user.id}> Earned ${randomXP} XP`)

                    await profileModel.findOneAndUpdate(
                        {
                            userID: mention.id
                        },
                        {
                            $inc: {
                                gold: amount,
                            },
                        }); // Add Money Mentioned(Robbed) User's Wallet
                    await profileModel.findOneAndUpdate(
                        {
                            userID: user.id
                        },
                        {
                            $inc: {
                                gold: -amount,
                            },
                        }); // Substract Money From User's Wallet
                }

                if (hasLeveledUP) {

                    const user = await Levels.fetch(message.author.id);
                    const target = message.author
                    await profileModel.findOneAndUpdate(
                        {
                            userID: target.id,
                        },
                        {
                            $inc: {
                                gold: 1000,
                                minions: 1
                            },
                        });

                    sendEmbed.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
                }
                return message.channel.send(sendEmbed);
            } catch (err) {
                console.log(err)
            }
        }
    }

};