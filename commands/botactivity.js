module.exports = {
    name: 'bot activity',
    aliases: ['ba'],

    async execute(message, args, cmd, client) {

        if (message.member.id != "532192409757679618" && message.member.id != "692180465242603591") return message.channel.send(`Sorry only **Noongar1800** and **PrimeWarGamer** can run this command 😔`);

        if (args[0] === "playing"){
            types = 0
        } else if (args[0] === "streaming") {
            types = 1
        } else if (args[0] === "listening") {
            types = 2
        } else if (args[0] === "watching") {
            types = 3
        } else if (args[0] === "competing") {
            types = 5
        } else if (args[0] === "reset") {
        
            client.user.setActivity(`.help`, {type:"LISTENING"}) //you can change that to whatever you like
        
            return message.channel.send('Status changed succesfully')
        
        } else {
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