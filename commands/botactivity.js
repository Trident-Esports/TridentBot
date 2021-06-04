module.exports = {
    name: 'bot activity',
    aliases: ['ba'],

    async execute(message, args, cmd, client) {

        APPROVED_USERIDS = [
          "263968998645956608", // Mike
          "532192409757679618", // Noongar
          "692180465242603591"  // PrimeWarGamer
        ]

        if (APPROVED_USERIDS.indexOf(message.member.id + "") == -1) return message.channel.send(
          `Sorry only ` +
          `**MikeTrethewey**,` +
          `**Noongar1800** or ` +
          `**PrimeWarGamer**` +
          ` can run this command 😔`
        );

        typeIndexes = [
          "playing",    // 0
          "streaming",  // 1
          "listening",  // 2
          "watching",   // 3
          "moo",        // 4
          "competing",  // 5
          "reset"       // 6
        ]
        types = -1
        if(typeIndexes.indexOf(args[0]) > -1) {
          types = typeIndexes.indexOf(args[0])
        }

        if (types == 6) {
            client.user.setActivity(`.help`, {type:"LISTENING"}) //you can change that to whatever you like

            return message.channel.send('Status changed succesfully')
        } else if(types == -1) {
            return message.channel.send('Invalid activity type.')
        }
        //here you tell the bot what the activity is
            args.shift()
            content = args.join(' ')
            client.user.setPresence({
                activity: {
                    name: content,
                    type: types
                }
            })
            message.channel.send('Status changed succesfully')

    }
}
