//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class DepositCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'deposit',
            aliases: ['dep'],
            group: 'game',
            memberName: 'deposit',
            description: 'Deposit Gold into your Bank',
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "How much do you want to deposit?",
                    type: "integer",
                    min: 0
                }
            ]
        }
        let props = {
            flags: {
                user: "default",
                target: "invalid",
                bot: "invalid"
            }
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          {},
          { amount:  "0" },
          { amount: "-1" },
          { amount:  "1" },
          { amount:   0 },
          { amount:  -1 },
          { amount:   1 }
        ]

        for(let added of varArgs) {
            let args = added
            dummy = new DepositCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
