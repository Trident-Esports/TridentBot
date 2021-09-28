//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class WithdrawCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'withdraw',
            aliases: ['wd','with'],
            group: 'game',
            memberName: 'withdraw',
            description: 'Withdraw Gold from your bank',
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "How much do you want to withdraw?",
                    type: "integer"
                }
            ]
        }
        super(
            client,
            {...comprops},
            {
                flags: {
                    user: "default",
                    target: "invalid",
                    bot: "invalid"
                }
            }
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
            dummy = new WithdrawCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
