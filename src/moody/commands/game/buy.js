//@ts-check

const RefundCommand = require('../../commands/game/refund');
const ShopCommand = require('../../classes/command/shopcommand.class');

module.exports = class BuyCommand extends ShopCommand {
    constructor(client) {
        let comprops = {
            name: 'buy',
            group: 'game',
            memberName: 'buy',
            description: 'Buy an Item from the Store',
            guildOnly: true,
            examples: [
                "buy 🍌",
                "buy 🍌 2",
                "buy banana",
                "buy banana 2"
            ]
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

    async test(client, message, args) {
        let dummy = null

        dummy = new RefundCommand(client)
        dummy.run(message,
          {
            target: message.author,
            amount:
              ((
                500 +
                2000000 +
                200 +
                2000
              ) * 3) + ""
          }
        )

        const baseArgs = []
        const varArgs = [
          {item: ""},
          {item: "🍌"},
          {item: "🚗"},
          {item: "🧪"},
          {item: "💉"},
          {quantity: "0"},
          {quantity: "1"},
          {quantity: "2", item: "🍌"},
          {quantity: "2", item: "🚗"},
          {quantity: "2", item: "🧪"},
          {quantity: "2", item: "💉"},
          {item: "🍌", quantity: "2"},
          {item: "🚗", quantity: "2"},
          {item: "🧪", quantity: "2"},
          {item: "💉", quantity: "2"}
        ]

        for(let added of varArgs) {
            let args = added
            dummy = new BuyCommand(client)
            dummy.props.footer.msg = typeof args === "object" && typeof args.join === "function" ? args.join(" | ") : '```' + JSON.stringify(args) + '```'
            await dummy.run(message, args)
        }
    }
}
