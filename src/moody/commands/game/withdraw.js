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
            flags: {
                user: "default",
                target: "invalid",
                bot: "invalid"
            }
        }
        super(
            client,
            {...comprops}
        )
    }

    async test(message) {
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
            dummy = new WithdrawCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
