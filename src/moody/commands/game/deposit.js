//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class DepositCommand extends ATMCommand {
    constructor() {
        let comprops = {
            name: 'deposit',
            aliases: ['dep'],
            description: 'Deposit gold into your bank',
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
            let args = baseArgs.concat([ added ])
            dummy = new DepositCommand()
            dummy.props.footer.msg = args.join('|')
            dummy.run(client, message, args, null, "")
        }
    }
}
