const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class UseCommand extends GameCommand {
    constructor() {
        super({
            name: 'use',
            category: 'game',
            description: 'Use your items',
            extensions: ["levels", "profile", "inventory", "xpboost", "health"]
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Use"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        var user = message.author

        const inventoryData = await this.inventoryModel.findOne({
            userID: user.id
        });
        const profileData = await this.profileModel.findOne({
            userID: message.author.id
        })

        if (!inventoryData) {
            return message.reply("This user doesn't exist");
        }
        if (!user.id) {
            return message.reply("There was an arror finding your discord id");
        }

        var used_item = args.slice(0).join(" ").toLowerCase()

        if(!used_item || used_item !== "life potion" || "bananas" ) {
            props.description = `This Item doesn't exist (${used_item})`
        }

        if (used_item === 'life potion') {

            var lifepotioncheck = await this.inventoryModel.findOne({
                userID: user.id
            }, {
                consumables: ['🧪']
            });
            if (lifepotioncheck === null || undefined || 0) {
                message.reply('You must have a life potion to heal.')
            } else {
                await this.inventoryModel.findOneAndUpdate({
                    userID: user.id,
                }, {
                    $pull: {
                        consumables: ['🧪'] * 1,
                    },
                });
                await this.healthModel.findOneAndUpdate({
                    userID: message.author.id,
                }, {
                    $set: {
                        health: 100,
                    },
                });
                props.description = `${user} just used 1 🧪 Life Potion!
                Their Health has been restored`
            }
        }

        if (used_item === 'bananas') {
            await this.inventoryModel.findOneAndUpdate({
                userID: user.id,
            }, {
                $pull: {
                    items: ['🍌'] * 1,
                },
            });
            props.description = `${user} just used 1 🍌.\nTheir minions are now happily satisfied.`

            let embed = new VillainsEmbed(props)
            await this.send(message, embed);

            var number = Math.round(Math.random() * 100);
            var minionsmultiple = Math.round(profileData.minions / 4);

            var success = 4;
            var fail = 99;
            var special = 100;

            if (number <= success) {
                await this.XPBoostModel.findOneAndUpdate({
                    userID: message.author.id,
                }, {
                    $inc: {
                        xpboost: 25,
                    },
                });
                props.description += 'You have fed your minions and they are now by your side. Gaining you a 25% XP Boost!'
            } else if (number <= fail) {
                return;
            } else if (number <= special) {
                await this.profileModel.findOneAndUpdate({
                    userID: message.author.id,
                }, {
                    $inc: {
                        minions: minionsmultiple,
                    },
                });
                props.description += `Wait what is this?!? Your Minions have just multiplied. You just gained ${minionsmultiple} Minions`
            }
        }
        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
};