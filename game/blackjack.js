


module.exports = {
    name: "blackjack",
    aliases: ['bj'],
    description: "Play some BlackJack",

    async execute(message, args, cmd, client) {

        message.channel.send("`COMING SOON!`");
        // async function bj(players_id, players_names) {
        //     var pc = players_id.length; //player count
        //     var turn; //whose turn is it? based on id
        //     var disp; //text to be shown in embed; game status.
        //     var hands = []; //each player's hand
        //     var handValues = []; //the sum of the cards in a hand
        //     var cards = ["A", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]; //all possible cards
        //     var ing = []; //is player in game? / have they busted?

        //     turn = players_id[0];
        //     var disp_dir = "React with �� to hit and ✋ to stand.";
        //     disp = `Currently ${message.member.guild.members.get(turn).displayName}'s turn.\n${disp_dir}`;

        //     function addCard() { return (cards[Math.floor(Math.random() * cards.length)]) }; //simply grabs a card from the list of cards

        //     function findHandValue(handValue, currentCards) { //takes two inputs, one is the current hand value, the other is a list of card values. finds the total value of the hand and returns it.
        //         var val = 0;
        //         for (i = 0; i < currentCards.length; i++) {
        //             card = currentCards[i];
        //             if (card == "A") {
        //                 if (handValue > 21) { val += 1; } else { val += 11; };
        //             } else if (card == "J" || card == "Q" || card == "K") {
        //                 val += 10;
        //             } else { val += card; };
        //         };
        //         return (val);
        //     };

        //     function makeEmbed(first) { //constructs the embed that will be used to show the game. param. first tells whether it is the first time the embed is being constrcuted in a game.
        //         var bjg = new Discord.RichEmbed()
        //             .setTitle("Blackjack Game")
        //             .setDescription(`Initiated by ${players_names[0]}`)
        //             .addField("Status", `${disp}`)
        //             .setThumbnail("https://cdn.discordapp.com/attachments/563578266984775681/657323254813425674/cards.jpg")
        //             .setColor("DC134C")
        //             .setFooter("Valkyrie", client.avatarURL)
        //             .setTimestamp();

        //         if (first == true) {
        //             for (i = 0; i < pc; i++) { //should be creating each player's hand
        //                 ing.push(true); //this one works
        //                 hands.push([addCard(), addCard()]); //but for some reason, this one returns undefined
        //                 handValues.push(findHandValue(0, hands[i])); //and this one
        //                 bjg.addField(`${players_names[i]}'s Hand`, `${hands[i]}\n\nValue: ${handValues[i]}`); //spits out undefined in almost every place, including the player_name[i]
        //                 var bjs = message.channel.send(bjg);
        //                 return (bjs);
        //             };
        //         };
        //     };
        //     var bjs = await makeEmbed(true); //and this stuff works fine
        //     await bjs.react("��");
        //     await bjs.react("✋");
        // }
        // if (args[0] = "quick")
        //     message.reply("You've started a game of solo blackjack against a bot!");
        // await bj([message.author.id], [message.member.displayName]);

    }
}