const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

// ATMCommand: User to User, like Give

module.exports = class RobCommand extends GameCommand {
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
            caption: {
                text: "Rob",
                avatar: "",
                url: ""
            },
            title: {},
            description: "",
            footer: {
                msg: ""
            },
            players: {
                user: {},
                target: {}
            }
        }

        const user = message.author
        const target = message.mentions.members.first();

        if (user) {
            props.players.user = {
                name: user.username,
                avatar: user.displayAvatarURL({ format: "png", dynamic: true })
            }
        }

        if (!target) {
            //FIXME: Cooldown
            // this.cooldown = 0;
            props.title.text = "Error"
            props.description = "You gotta choose someone to rob."
        }
        if (target?.user?.bot && target.user.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }
        if (target?.id && (user.id === target.id)) {
            //FIXME: Cooldown
            // this.cooldown = 0;
            props.title.text = "Error"
            props.description = "You can't rob yourself, dummy!"
        }

        if (props.title.text != "Error") {
            const profileData = await this.profileModel.findOne({
                userID: target.id
            })
            const usermoney = this.profileModel.findOne({
                userID: user.id,
                gold: profileData.gold
            })
            const targetmoney = this.profileModel.findOne({
                userID: target.id,
                gold: profileData.gold
            })
            props.players.target = {
                name: target.user.username,
                avatar: target.user.displayAvatarURL({ format: "png", dynamic: true })
            }

            let options = [
                'Success',
                'Failed',
                'Paid'
            ]
            let final = options[
                Math.floor(
                    Math.random() * parseInt(options.length)
                )
            ]

            let minSteal = 500

            if (usermoney < minSteal) {
                // You need >= $minSteal
                props.title.text = "Error"
                props.description = `You need at least ${this.emojis.gold}${minSteal} in your wallet to rob someone!`
            }
            if (targetmoney < minSteal) {
                // Target needs >= $minSteal
                props.title.text = "Error"
                props.description = `Mentioned user needs to have at least ${this.emojis.gold}${minSteal} in their wallet to rob!`
            }

            if (props.title.text != "Error") {
                props.caption.text = `Holding your hostage at Gunpoint.`
                props.title.text = `You try to rob them.`

                // XP Reward 30 - 150
                let [minXP, maxXP] = [30, 150]
                const randomXP = Math.floor(Math.random() * (maxXP - minXP)) + minXP;

                // Gold Reward: 100 - 1500
                let [minReward, maxReward] = [100, 1500]
                const amount = Math.floor(Math.random() * (maxReward - minReward)) + minReward

                // Ding?
                let hasLeveledUP = false

                if (final === 'Success') {
                    hasLeveledUP = await this.Levels.appendXp(message.author.id, 1, randomXP);

                    if (targetmoney.gold < amount) {
                        amount = targetmoney.gold
                    }

                    props.description = `<@${user.id}> robbed <@${target.id}> and got away with...`
                    props.fields = [
                        {
                            name: `${this.emojis.gold}${amount}`,
                            value: "Gold",
                            inline: true
                        },
                        {
                            name: `${this.emojis.xp}${randomXP}`,
                            value: "XP",
                            inline: true
                        }
                    ]

                    // Add $minSteal to User
                    let inc = { gold: amount }
                    await this.profileModel.findOneAndUpdate({
                        userID: user.id
                    }, {
                        $inc: inc
                    });

                    // Remove $minSteal from Target
                    inc = { gold: -amount }
                    await this.profileModel.findOneAndUpdate({
                        userID: target.id
                    }, {
                        $inc: inc
                    });

                } else if (final === 'Failed') {
                    hasLeveledUP = await this.Levels.appendXp(message.author.id, 1, randomXP);

                    props.description = [
                        `<@${user.id}> tried to rob <@${target.id}>. You realise they are poor.`,
                        `You **earned**...`
                    ].join("\n")
                    props.fields = [
                        {
                            name: `${this.emojis.xp}${randomXP}`,
                            value: "XP",
                            inline: true
                        }
                    ]

                } else if (final === 'Paid') {
                    hasLeveledUP = await this.Levels.appendXp(message.author.id, 1, randomXP);

                    props.description = [
                        `<@${user.id}> tried to rob <@${target.id}>. You were caught and instead <@${target.id}> stole your gun and robbed you of **${this.emojis.gold}${amount}**.`,
                        "WHAT A FAIL!",
                        "",
                        `You **earned**...`
                    ].join("\n")
                    props.fields = [
                        {
                            name: `__**${this.emojis.gold}-${amount}**__`,
                            value: "~~Gold~~",
                            inline: true
                        },
                        {
                            name: `${this.emojis.xp}${randomXP}`,
                            value: "XP",
                            inline: true
                        }
                    ]

                    // Add $minSteal to Target
                    let inc = { gold: amount }
                    await this.profileModel.findOneAndUpdate({
                        userID: target.id
                    }, {
                        $inc: inc
                    });

                    // Remove $minSteal from User
                    inc = { gold: -amount }
                    await this.profileModel.findOneAndUpdate({
                        userID: user.id
                    }, {
                        $inc: inc
                    });
                }

                if (hasLeveledUP) {
                    const user = await this.Levels.fetch(message.author.id, 1);
                    const target = message.author
                    let inc = { gold: 1000, minions: 1 }
                    await this.profileModel.findOneAndUpdate({
                        userID: target.id,
                    }, {
                        $inc: inc
                    });
                    props.footer.msg = [
                        `${message.author.username} You just Advanced to Level ${user.level}!`,
                        `You have gained: ${this.emojis.gold}${inc.gold}, ${this.emojis.minions}${inc.minions}`
                    ].join(" · ")
                }
            }
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};
