//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class BurnCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'burn',
            group: 'game',
            memberName: 'burn',
            description: 'Burn Gold from your Wallet',
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "How much do you want to burn?",
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
            dummy = new BurnCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
