//@ts-check

const ATMCommand = require('../../classes/command/atmcommand.class');

module.exports = class DepositCommand extends ATMCommand {
    constructor(client) {
        let comprops = {
            name: 'deposit',
            aliases: ['dep'],
            group: 'game',
            memberName: 'deposit',
            description: 'Deposit Gold into your Bank'
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
            dummy = new DepositCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
