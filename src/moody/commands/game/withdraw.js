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
          "",
          "0",
          "-1",
          "1"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new WithdrawCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
