//@ts-check

const GameCommand = require('../../../classes/command/gamecommand.class');

module.exports = class BalanceCommand extends GameCommand {
    constructor() {
        let comprops = {
            name: 'balance',
            aliases: ['bal'],
            category: 'premium',
            description: 'Checks the Users Balance',
            extensions: [ "profile" ]
        }
        super(
            {...comprops}
        )
    }

    async action(client, message) {
        // Get loaded target
        const loaded = this.inputData.loaded

        // Get loaded profile data
        const profileData = await this.db_query(loaded.id, "profile")

        this.props.description = `This is <@${loaded.id}>'s Balance`
        this.props.fields = [
            {
                name: ` ${this.emojis.gold}${profileData.gold.toLocaleString("en-AU")}`,
                value: 'Gold',
                inline: true
            },
            {
                name: ` ${this.emojis.bank}${profileData.bank.toLocaleString("en-AU")}`,
                value: 'Bank',
                inline: true
            },
            {
                name: ` ${this.emojis.minions}${profileData.minions}`,
                value: 'Minions',
                inline: true
            }
        ]
    }

    async test(client, message) {
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
            dummy = new BalanceCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args, null, "")
        }
    }
}
