const inventoryModel = require('../models/inventorySchema');
const healthModel = require('../models/healthSchema');
const profileModel = require('../models/profileSchema');
const XPBoostModel = require('../models/xpboostSchema');

module.exports = {
    name: "use",
    description: "Use a players Item",

    async execute(message, args, profileData) {

        var user = message.author
        const inventoryData = await inventoryModel.findOne({ userID: user.id });

        if (!inventoryData) return message.channel.send("This user doesn't exist");
        if (!user.id) return message.channel.send("There was an arror finding your discord id");

        var used_item = args.slice(0).join(" ").toLowerCase()

        if (used_item === 'life potion') {

            var lifepotioncheck = await inventoryModel.findOne({ userID: user.id }, { consumables: ['🧪'] });
            if (lifepotioncheck === null || undefined || 0) {
                message.channel.send('You must have a life potion to heal.')
                console.log(lifepotioncheck)
            }
            else {
                await inventoryModel.findOneAndUpdate(
                    {
                        userID: user.id,
                    },
                    {
                        $pull: {
                            consumables: ['🧪'] * 1,
                        },
                    });
                await healthModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                    },
                    {
                        $set: {
                            health: 100,
                        },
                    });
                message.channel.send(`${user} just used 1 🧪 Life Potion!\nTheir Health has been restored`)
            }
        }

        if (used_item === 'bananas') {
            await inventoryModel.findOneAndUpdate(
                {
                    userID: user.id,
                },
                {
                    $pull: {
                        items: ['🍌'] * 1,
                    },
                });
            message.channel.send(`${user} just used 1 🍌.\nTheir minions are now happily satisfied.`)

            var number = Math.round(Math.random() * 100);
            var minionsmultiple = Math.round(profileData.minions / 4);

            var success = 4;
            var fail = 99;
            var special = 100;

            console.log(number);

            if (number <= success) {
                await XPBoostModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                    },
                    {
                        $inc: {
                            xpboost: 25,
                        },
                    });
                return message.channel.send('You have fed your minions and they are now by your side. Gaining you a 25% XP Boost!')
            }

            else if (number <= fail) {
                return;
            }
            else if (number <= special) {
                await profileModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                    },
                    {
                        $inc: {
                            minions: minionsmultiple,
                        },
                    });
                return message.channel.send(`Wait what is this?!? Your Minions have just multiplied. You just gained ${minionsmultiple} Minions`);
            }
        }
        console.log(inventoryData.items);
    }
};