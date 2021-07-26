const GameCommand = require('../../../classes/gamecommand.class');

module.exports = class LevelCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'level',
            aliases: ['lvl'],
            category: 'premium',
            description: 'Checks the Users Level',
            extensions: [ "levels", "xpboost" ]
        }
        super(comprops)
    }
    async action(client, message) {
        // Get loaded target
        const loaded = this.inputData.loaded

        // Get loaded level data
        const levelData = await this.db_query(loaded.id, "levels");
        if (!levelData) {
            this.error = true
            this.props.description = "This user doesn't have a Level.😢"
            return
        }

        // Get loaded XP Boost data
        const XPBoostData = await this.db_query(loaded.id, "xpboost")

        this.props.description = `This is <@${loaded.id}>'s Level`
        this.props.fields = [
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
                name: `${this.emojis.xpboost}${XPBoostData.xpboost}%`,
                value: "XPBoost",
                inline: false
            }
        ]
    }
}
