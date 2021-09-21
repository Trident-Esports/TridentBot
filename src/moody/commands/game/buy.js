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
            ],
            args: [
                {
                    key: "item",
                    prompt: "What do you want to buy?",
                    type: "string"
                },
                {
                    key: "quantity",
                    prompt: "How many do you want to buy?",
                    type: "integer",
                    min: 0
                }
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

    async test(client, message) {
        let dummy = null

        dummy = new RefundCommand(client)
        dummy.run(message, [
          message.author.id,
          ((
            500 +
            2000000 +
            200 +
            2000
          ) * 3)
        ])

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
            dummy = new BuyCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            await dummy.run(message, args)
        }
    }
}
