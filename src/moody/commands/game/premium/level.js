//@ts-check

const GameCommand = require('../../../classes/command/gamecommand.class');

module.exports = class LevelCommand extends GameCommand {
    constructor(client) {
        let comprops = {
            name: 'level',
            aliases: ['lvl'],
            group: 'game/premium',
            memberName: 'level',
            description: 'Checks the Users Level'
        }
        super(
            client,
            {...comprops},
            {
                extensions: [ "levels", "xpboost" ]
            }
        )
    }
    async action(message) {
        const loaded = this.inputData.loaded

        const levelData = await this.db_query(loaded.id, "levels");
        if (!levelData) {
            this.error = true
            this.props.description = "This user doesn't have a Level.😢"
        }

        if (!(this.error)) {
            const XPBoostData = await this.db_query(loaded.id, "xpboost")

            this.props.description = `This is <@${loaded.id}>'s Level`
            this.props.fields = [
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
                    name: `${this.emojis.xpboost}${XPBoostData.xpboost}%`,
                    value: "XPBoost",
                    inline: false
                }
            ]
        }
    }

    async test(message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          message.author.username,
          message.author.id,
          client.user.username,
          "Wanrae"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new LevelCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
