const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'gamehelp',
    aliases: ['gh'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
        let props = {
            "embedColor": "#B217EE",  // Purple; Default is B2EE17 (Green)
            "title": "***Game Help***",
            "url": "https://discord.com/KKYdRbZcPT",
            "thumbnail": "https://cdn.discordapp.com/icons/788021898146742292/a_cc4d6460f0b5cc5f77d65aa198609843.gif"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const newEmbed = new MessageEmbed()
            .setColor(props["embedColor"])
            .setTitle(props["title"])
            .setURL(props["url"])
            .setDescription(' This is a list of commands for the VillainsBot MiniGame')
            .addFields(
                { name: '**PERSONAL COMMANDS**', value: 'List of commands only involving you' },
                { name: '`gamehelp`', value: '_Brings up this menu\n_ [Aliases: gh]' },
                { name: '`profile`', value: '_Shows your entire profile_\n [Aliases: pr , acc]' },
                { name: '`level @user`', value: '_Shows your Level or the targets level_\n [Aliases: lvl]' },
                { name: '`balance`', value: '_Shows your Balance\n_ [Aliases: bal]' },
                { name: '`deposit`', value: '_Deposit Gold into you Bank\n_ [Aliases: dep]' },
                { name: '`withdraw`', value: '_Make a Withdrawal from your Bank\n_ [Aliases: wd]' },
                {name: '`beg`', value: "_Beg's for a random amount of Money_"},
                {name: '`search`', value: "_Allows you to pick 1 of 3 random locations to search for some Gold_"},
                {name: '`inventory`', value: "_Check the Items you have._\n[Aliases: i]"},
                {name: '`.shop`', value: "_Allows you to see what Items are Available to Buy_"},
                {name: '`.daily`', value: "_Recieve a Daily Gift._"},
                {name: '`.buy (Item)`', value: "_Allows you to Buy Items_"}
                )
            .addFields(
                { name: '**INTERACTIVE COMMANDS**', value: 'Extra commands involving the Villains community' },
                { name: '`give @user (amount)`', value: '_Gives the tagged player the specified amount of Gold from your Wallet_' },
                { name: '`fight @user`', value: "_Fight another user for Bragging Rights and Winnings of Gold!_" },
                { name: '`rob @user`', value: "_Robs another user for Gold! Look out though this could Backfire._" },
                {name: '`leaderboard`', value: "_Show's the current top 10 users_\n [Aliases: lb]"}
            )
            .addFields(
                { name: '**GAMBLE COMMANDS**', value: "Gambling commands. Please don't become addicted!" },
                { name: '`.coinflip (amount)`', value: '_Gamble some Gold on a coinflip!_\n[Aliases: cf]' }

            )
            .setThumbnail(props["thumbnail"])
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send("I have sent some Minions to your dm's.");
        message.channel.send("https://tenor.com/view/minions-despicable-me-cheer-happy-yay-gif-3850878")
        message.author.send(newEmbed);
    }
}
