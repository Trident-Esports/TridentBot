const GameCommand = require('../../classes/gamecommand.class');

// ATMCommand: User to User, like Give

module.exports = class RobCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'rob',
            category: 'game',
            description: 'Rob someone for Money',
            extensions: ["levels", "profile"],
            flags: {
                user: "invalid",
                target: "required",
                bot: "invalid"
            }
        }
        super(comprops)
    }

    async action(client, message) {
        // Get user
        const user = message.author
        // Get loaded target
        const target = this.inputData.loaded

        this.props.title = {}

        const userData = await this.db_query(user.id, "profile")
        const targetData = await this.db_query(target.id, "profile")
        const usermoney = userData.gold
        const targetmoney = targetData.gold

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

        // Bail if you don't have enough balls to rob someone
        if (usermoney < minSteal) {
            // You need >= $minSteal
            this.error = true
            this.props.description = `You need at least ${this.emojis.gold}${minSteal} in your wallet to rob someone!`
            return
        }

        // Bail if they don't have that much to rob
        if (targetmoney < minSteal) {
            // Target needs >= $minSteal
            this.error = true
            this.props.description = `Mentioned user needs to have at least ${this.emojis.gold}${minSteal} in their wallet to rob!`
            return
        }

        this.props.caption.text = `Holding your hostage at Gunpoint.`
        this.props.title.text = `You try to rob them.`

        // XP Reward 30 - 150
        let [minXP, maxXP] = [30, 150]
        const randomXP = Math.floor(Math.random() * (maxXP - minXP)) + minXP;

        // Gold Reward: 100 - 1500
        let [minReward, maxReward] = [100, 1500]
        const amount = Math.floor(Math.random() * (maxReward - minReward)) + minReward

        // Ding?
        let hasLeveledUP = false

        if (final === 'Success') {
            hasLeveledUP = await this.db_transform(message.author.id, "xp", randomXP);

            if (targetmoney.gold < amount) {
                amount = targetmoney.gold
            }

            this.props.description = `<@${user.id}> robbed <@${target.id}> and got away with...`
            this.props.fields = [
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
            await this.db_transform(user.id, "gold", amount)

            // Remove $minSteal from Target
            await this.db_transform(target.id, "gold", -amount)

        } else if (final === 'Failed') {
            hasLeveledUP = await this.db_transform(message.author.id, "xp", randomXP);

            this.props.description = [
                `<@${user.id}> tried to rob <@${target.id}>. You realise they are poor.`,
                `You **earned**...`
            ].join("\n")
            this.props.fields = [
                {
                    name: `${this.emojis.xp}${randomXP}`,
                    value: "XP",
                    inline: true
                }
            ]

        } else if (final === 'Paid') {
            hasLeveledUP = await this.db_transform(message.author.id, "xp", randomXP);

            this.props.description = [
                `<@${user.id}> tried to rob <@${target.id}>. You were caught and instead <@${target.id}> stole your gun and robbed you of **${this.emojis.gold}${amount}**.`,
                "WHAT A FAIL!",
                "",
                `You **earned**...`
            ].join("\n")
            this.props.fields = [
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
            await this.db_transform(target.id, "gold", amount)

            // Remove $minSteal from User
            await this.db_transform(user.id, "gold", -amount)
        }

        // Ding message
        if (hasLeveledUP) {
            const levelData = await this.db_query(target.id, "levels");
            let gainedmoney = 1000
            let gainedminions = 1
            let inc = {
                gold: gainedmoney,
                minions: gainedminions
            }
            await this.db_transform(target.id, inc)

            let msg = [
                `You just Advanced to Level ${levelData.level.toLocaleString("en-AU")}!`,
                `You have gained: ${this.emojis.gold}${gainedmoney.toLocaleString("en-AU")}, ${this.emojis.minions}${gainedminions.toLocaleString("en-AU")}`
            ].join(" • ")

            this.props.description += msg
        }
    }
}
