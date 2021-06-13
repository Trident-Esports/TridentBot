const profileModel = require("../models/profileSchema");

module.exports = {
  name: "give",
  aliases: [],
  permissions: [],
  description: "refunds a player some coins",
  async execute(message, args, profileData) {

    if (!args.length) return message.channel.send("You need to mention a player to give them coins");

    var amount = args[1].toLowerCase()

    if (amount == 'all') amount = profileData.gold;
    if (amount == 'half') amount = profileData.gold / 2;

    const target = message.mentions.users.first();
    if (!target) return message.channel.send("That user does not exist");

    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Deposit amount must be a whole number");

    try {
      const targetData = await profileModel.findOne({ userID: target.id });
      if (!targetData) return message.channel.send(`This user doensn't exist in the database`);

      await profileModel.findOneAndUpdate(
        {
          userID: target.id,
        },
        {
          $inc: {
            gold: amount,
          },
        });

      await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            gold: -amount,
          },
        }
      );

      return message.channel.send(`${message.author} just gave ${target} ${amount} coins!`);
    } catch (err) {
      console.log(err);
    }
  },
};