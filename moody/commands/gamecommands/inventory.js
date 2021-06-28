const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class InventoryCommand extends GameCommand {
    constructor() {
        super({
            name: 'inventory',
            aliases: ['i', 'inv'],
            category: 'game',
            description: 'Check a users Inventory',
            extensions: ["inventory"]
        });
    }

    async run(client, message, args) {
        let props = {
            title: {
                text: "Inventory"
            },
            description: "",
            footer: {
                msg: ""
            }
        }

        let mentionedMember = null;
        if (args.length) {
            mentionedMember = message.mentions.members.first().user;
        } else {
            mentionedMember = message.author;
        }

        if (!mentionedMember) return message.channel.send("That user does not exist");
        const inventoryData = await this.inventoryModel.findOne({
            userID: mentionedMember.id
        });

        let tempItems = [];
        let placedItems = [];

        for (var x = 0; x < inventoryData.items.length; x++) {
            tempItems.push(inventoryData.items[x]);
        }

        var placed = false;
        for (var x = 0; x < tempItems.length; x++) {
            placed = false;
            for (var y = 0; y < placedItems.length; y++) {
                if (tempItems[x] == placedItems[y][0]) {
                    placedItems[y][1]++;
                    placed = true;
                }
            }
            if (!placed) {
                placedItems.push([tempItems[x], 1]);
            }
        }

        let newItems = ``;

        for (var x = 0; x < placedItems.length; x++) {
            newItems += `${placedItems[x][0]} x ${placedItems[x][1]}`;
            if (x != placedItems.length - 1) {
                newItems += `\n`;
            }
        }

        if (newItems === ``)
            newItems = 'Nothing'

        let tempConsumables = [];
        let placedConsumables = [];

        for (var x = 0; x < inventoryData.consumables.length; x++) {
            tempConsumables.push(inventoryData.consumables[x]);
        }

        var placed = false;
        for (var x = 0; x < tempConsumables.length; x++) {
            placed = false;
            for (var y = 0; y < placedConsumables.length; y++) {
                if (tempConsumables[x] == placedConsumables[y][0]) {
                    placedConsumables[y][1]++;
                    placed = true;
                }
            }
            if (!placed) {
                placedConsumables.push([tempConsumables[x], 1]);
            }
        }

        let newConsumables = ``;

        for (var x = 0; x < placedConsumables.length; x++) {
            newConsumables += `${placedConsumables[x][0]} x ${placedConsumables[x][1]}`;
            if (x != placedConsumables.length - 1) {
                newConsumables += `\n`;
            }
        }

        if (newConsumables === ``)
            newConsumables = 'Nothing'

        let tempPowers = [];
        let placedPowers = [];

        for (var x = 0; x < inventoryData.powers.length; x++) {
            tempPowers.push(inventoryData.powers[x]);
        }

        var placed = false;
        for (var x = 0; x < tempPowers.length; x++) {
            placed = false;
            for (var y = 0; y < placedPowers.length; y++) {
                if (tempPowers[x] == placedPowers[y][0]) {
                    placedPowers[y][1]++;
                    placed = true;
                }
            }
            if (!placed) {
                placedPowers.push([tempPowers[x], 1]);
            }
        }

        var newPowers = ``;

        for (var x = 0; x < placedPowers.length; x++) {
            newPowers += `${placedPowers[x][0]} x ${placedPowers[x][1]}`;
            if (x != placedPowers.length - 1) {
                newPowers += `\n`;
            }
        }

        if (newPowers === ``)
            newPowers = 'Nothing'

        props.description = `${mentionedMember}'s Inventory`


        props.fields = [{
            name: '***Items***',
            value: newItems,
            inline: true
        }, {
            name: '***Consumables***',
            value: newConsumables,
            inline: true
        }, {
            name: '***Powers***',
            value: newPowers,
            inline: true
        }]

        let embed = new VillainsEmbed(props)
        this.send(message, embed);
    }
}