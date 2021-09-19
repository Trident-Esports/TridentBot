//@ts-check

const RefundCommand = require('../../commands/game/refund');
const ShopCommand = require('../../classes/command/shopcommand.class');

module.exports = class BuyCommand extends ShopCommand {
    constructor() {
        let comprops = {
            name: 'buy',
            category: 'game',
            description: 'Buy an Item from the Store',
            extensions: [ "inventory", "profile" ]
        }
        super(
            {...comprops}
        )
    }

    async test(client, message) {
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
            let args = baseArgs.concat([ added ])
            dummy = new BuyCommand()
            dummy.props.footer.msg = args.join('|')
            dummy.run(client, message, args, null, "")
        }
    }
}
