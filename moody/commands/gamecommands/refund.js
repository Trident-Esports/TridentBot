const BotDevCommand = require('../../classes/botdevcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class StealCommand extends BotDevCommand {
    constructor() {
        super({
            name: 'refund',
            category: 'game',
            description: 'refunds a players coins',
            extensions: ["profile"]
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Refund"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

    //   APPROVED_USERIDS = [
    //     "263968998645956608", // Mike
    //     "532192409757679618", // Noongar
    //     "692180465242603591"  // PrimeWarGamer
    //   ]

    //   if (APPROVED_USERIDS.indexOf(message.member.id + "") == -1) return message.channel.send(
    //     `Sorry only ` +
    //     `**MikeTrethewey**,` +
    //     `**Noongar1800** or ` +
    //     `**PrimeWarGamer**` +
    //     ` can run this command 😔`
    //   );

      if (!args.length) {
          return message.reply("You need to mention a player to refund them Gold");
        }

      const amount = args[1];
      const target = message.mentions.users.first();

      if (!target) {
          return message.reply("That user does not exist");
        }

      if (amount % 1 != 0 || amount <= 0) return message.channel.send("Amount must be a whole number");

        const targetData = await this.profileModel.findOne({ userID: target.id });

        if (!targetData) {
            return message.reply(`This user doesn't exist in the db`);
        }

        await this.profileModel.findOneAndUpdate(
          {
            userID: target.id,
          },
          {
            $inc: {
              gold: amount,
            },
          }
        );

        props.description = `This player has been given ${amount.toLocaleString("en-AU")} Gold!`

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
  };
