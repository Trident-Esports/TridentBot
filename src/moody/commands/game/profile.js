//@ts-check

const GameCommand = require('../../classes/command/gamecommand.class');

module.exports = class ProfileCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'profile',
            aliases: ["pr", "acc"],
            category: 'game',
            description: 'Check the User\'s Profile',
            extensions: [ "profile", "health", "xpboost", "levels" ]
        }
        super(comprops)
    }

    async action(client, message) {
        const loaded = this.inputData.loaded

        if (!(this.error)) {
            const profileData = await this.db_query(loaded.id, "profile")
            const healthData = await this.db_query(loaded.id, "health")
            const XPBoostData = await this.db_query(loaded.id, "xpboost")
            const levelData = await this.db_query(loaded.id, "levels")

            if (!(profileData)) {
                this.error = true
                this.props.description = `No Profile Data found for <@${loaded.id}>!`
                return
            }
            if (!(healthData)) {
                this.error = true
                this.props.description = `No Health Data found for <@${loaded.id}>!`
                return
            }
            if (!(XPBoostData)) {
                this.error = true
                this.props.description = `No XPBoost Data found for <@${loaded.id}>!`
                return
            }
            if (!(levelData)) {
                this.error = true
                this.props.description = `No Level Data found for <@${loaded.id}>!`
                return
            }

            this.props.description = `This is <@${loaded.id}>'s Profile`
            this.props.fields = [
                {
                    name: "Title",
                    value: "Beta Tester"
                },
                {
                    name: `${this.emojis.level}${levelData.level}`,
                    value: "Level",
                    inline: true
                },
                {
                    // @ts-ignore
                    name: `${this.emojis.xp}${levelData.xp.toLocaleString("en-AU")} / ${this.Levels.xpFor(levelData.level + 1).toLocaleString("en-AU")}`,
                    value: "XP",
                    inline: true
                },
                {
                    name: `${this.emojis.life}${healthData.health}%`,
                    value: "Life",
                    inline: true
                },
                {
                    name: `${this.emojis.gold}${profileData.gold.toLocaleString("en-AU")}`,
                    value: "Gold",
                    inline: true
                },
                {
                    name: `${this.emojis.bank}${profileData.bank.toLocaleString("en-AU")}`,
                    value: "Bank",
                    inline: true
                },
                {
                    name: `${this.emojis.minions}${profileData.minions}`,
                    value: "Minions",
                    inline: true
                },
                {
                    name: `${this.emojis.xpboost}${XPBoostData.xpboost}%`,
                    value: "XPBoost",
                    inline: true
                }
            ]
        }
    }
}
