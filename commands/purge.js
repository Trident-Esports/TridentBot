module.exports = {
    name: 'purge',
    description: "deletes last messages",
    async execute(message, args, cmd, client) {
try{
        if(!message.member.roles.cache.some(r=>["Overlords", "Evil Council", "Mod/Council Helper", "Mod"].includes(r.name)))
            
        return message.channel.send('You dont have the correct permissions');

        if (!args[0])
            return message.reply("Please specify an amount of messages to delete.");
        if (isNaN(args[0]))
            return message.reply("please enter a real number");

        if (args[0] > 100)
            return message.reply("you cannot clear more than 100 messages");
        if (args[0] < 1)
            return message.reply("You must have a number greater then 1");

        await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
            message.channel.bulkDelete(messages)
        });
    }
    catch (err){
        console.log(err)
    }
    }
}