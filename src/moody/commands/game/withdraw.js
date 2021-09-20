//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class WithdrawCommand extends ATMCommand {
    constructor() {
        let comprops = {
            name: 'withdraw',
            aliases: ['wd','with'],
            description: 'Withdraw gold from your bank',
            flags: {
                user: "default",
                target: "invalid",
                bot: "invalid"
            }
        }
        super(
            {...comprops}
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
            dummy = new WithdrawCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args, null, "")
        }
    }
}
