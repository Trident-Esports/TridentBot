const GameCommand = require('../../classes/gamecommand.class');

module.exports = class ProfileCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'profile',
            aliases: ["pr", "acc"],
            category: 'game',
            description: 'Check the User\'s Profile',
            extensions: [ "profile", "health", "xpboost", "levels" ]
        }
        super(
            {...comprops}
        )
    }

    async action(client, message) {
        // Get loaded target
        const loaded = this.inputData.loaded

        // Get loaded target MongoDB data
        const profileData = await this.db_query(loaded.id, "profile")
        const healthData = await this.db_query(loaded.id, "health")
        const XPBoostData = await this.db_query(loaded.id, "xpboost")
        const levelData = await this.db_query(loaded.id, "levels")

        // Build the thing
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
