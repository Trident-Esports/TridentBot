//@ts-check

const RefundCommand = require('../../commands/game/refund');
const ShopCommand = require('../../classes/command/shopcommand.class');

module.exports = class BuyCommand extends ShopCommand {
    constructor(client) {
        let comprops = {
            name: 'buy',
            group: 'game',
            memberName: 'buy',
            description: 'Buy an Item from the Store'
        }
        let props = {
            extensions: [ "inventory", "profile" ]
        }
        super(
            client,
            {...comprops},
            {...props}
        )
    }

    async test(message) {
        let dummy = null

        dummy = new RefundCommand()
        dummy.run(client, message, [
          "miketrethewey",
          ((
            500 +
            2000000 +
            200 +
            2000
          ) * 3) + ""
        ], null, "")

        const baseArgs = []
        const varArgs = [
          "",
          "🍌",
          "🚗",
          "🧪",
          "💉",
          "0",
          "1",
          "2 🍌",
          "2 🚗",
          "2 🧪",
          "2 💉",
          "🍌 2",
          "🚗 2",
          "🧪 2",
          "💉 2"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new BuyCommand()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
