const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

const fs = require('fs');

module.exports = class BuyCommand extends GameCommand {
    constructor() {
        super({
            name: 'rob',
            category: 'game',
            description: 'Rob someone for Money',
            extensions: ["levels", "profile"]
        });
    }

    async run(client, message, args) {

        let props = {
            author: {
                name: "",
                avatar: ""
            },
            title: {
                text: ""
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        const randomXP = Math.floor(Math.random() * 120) + 30;
        const hasLeveledUP = await this.Levels.appendXp(message.author.id, 1, randomXP);

        const user = message.author
        const mention = message.mentions.members.first();

        const profileData = await this.profileModel.findOne({
            userID: mention.id
        })

        if (!mention) {
            this.cooldown = 0;
            return message.reply('Whom Do You Want Rob?');
        }
        if (mention.user.bot) {
            return message.reply("Now who's the Bot?🤡\nRob someone who isn't a bot next time dummy!");
        }
        if (user.id === mention.id) {
            this.cooldown = 0;
            return message.reply("You can't rob yourself dummy");
        }
        const usermoney = this.profileModel.findOne({
            userID: user.id,
            gold: profileData.gold
        }) // Same As balance.js // Get User Money
        const mentionmoney = this.profileModel.findOne({
            userID: mention.id,
            gold: profileData.gold
        }) // Same As balance.js // Get Mentioned User Money

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

        if (usermoney < 500) {
            return message.reply(`You Need Atleast ${this.emojis.gold}500 In Your Wallet To Rob Someone`)
        } // If User Money In Wallet Is Less Then 2000
        if (mentionmoney < 500) {
            return message.reply(`Mentioned User Should Have Atleast ${this.emojis.gold}500 In Wallet To Rob`)
        } // If Mentioned User Money In Wallet Is Less Then 2000

        if (final === 'Success') {

            const amount = Math.floor(Math.random() * 1400) + 100 // Min Is 100 And Max Is 1500(100+1400)

            if (mentionmoney.gold < amount) {
                amount = mentionmoney.gold
            }

            props.author.name = `Holding your hostage at Gunpoint.`
            props.author.avatar = user.displayAvatarURL({
                dynamic: true
            })
                props.title.text = `You try to rob them.`
                props.description = `<@${user.id}> Robbed <@${mention.id}> And Got Away With ${this.emojis.gold}**$${amount}**

                Earned ${randomXP} XP`

            await this.profileModel.findOneAndUpdate({
                userID: user.id
            }, {
                $inc: {
                    gold: amount,
                },
            }); // Add Money To User's Wallet
            await this.profileModel.findOneAndUpdate({
                userID: mention.id
            }, {
                $inc: {
                    gold: -amount,
                },
            }); // Substract Money From Mention(Robbed) User's Wallet

        } else if (final === 'Failed') {
            props.author.name = `Holding your hostage at Gunpoint.`
            props.author.avatar = user.displayAvatarURL({
                dynamic: true
            })
                props.title.text = `You try to rob them.`
                props.description = `<@${user.id}> tried To Rob <@${mention.id}>. You realise they are poor.

                Earned ${randomXP} XP`

        } else if (final === 'Paid') {

            const amount = Math.floor(Math.random() * 1400) + 100 // Min Is 100 And Max Is 1500(100+1400)

            props.author.name = `Holding your hostage at Gunpoint.`
            props.author.avatar = user.displayAvatarURL({
                    dynamic: true
                })
            props.title.text = `You try to rob them.`
            props.description = `<@${user.id}> tried to rob <@${mention.id}>. You were Caught and instead <@${mention.id}> stole your gun and robbed you of ${this.emojis.gold}**${amount}**.
            WHAT A FAIL!

            <@${user.id}> Earned ${randomXP} XP`

            await this.profileModel.findOneAndUpdate({
                userID: mention.id
            }, {
                $inc: {
                    gold: amount,
                },
            }); // Add Money Mentioned(Robbed) User's Wallet
            await this.profileModel.findOneAndUpdate({
                userID: user.id
            }, {
                $inc: {
                    gold: -amount,
                },
            }); // Substract Money From User's Wallet
        }

        if (hasLeveledUP) {

            const user = await this.Levels.fetch(message.author.id, 1);
            const target = message.author
            await this.profileModel.findOneAndUpdate({
                userID: target.id,
            }, {
                $inc: {
                    gold: 1000,
                    minions: 1
                }
            });
            props.footer.msg = `${message.author.username} You just Advanced to Level ${user.level}!
            You have gained: 💰+1000 , 🐵+1`
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};