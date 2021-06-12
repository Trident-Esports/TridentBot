const {
    MessageEmbed
} = require('discord.js');

const fs = require('fs')

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

module.exports = {
    name: "shop",
    aliases: ['store'],
    description: "View the store",

    async execute(message) {

        let stripe = defaults["stripe"]

        let props = {
            "title": "***ItemShop***",
            "description": "This is the ItemShop"
        }
        switch (stripe) {
            default:
                stripe = "#B2EE17";
                break;
        }

        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        let itemData = JSON.parse(fs.readFileSync("game/dbs/items.json", "utf8"))

        // Hack in my stuff to differentiate
        if (DEV) {
            stripe = GLOBALS["stripe"]
            defaults.footer = GLOBALS.footer
        }

        props["stripe"] = stripe

        const embed = new MessageEmbed()
            .setColor(props.stripe)
            .setTitle(props.title)
            .setURL(props.url)
            .setDescription(props.description)
            .setThumbnail(defaults.thumbnail)
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();

        for (let [items, itemsAttr] of Object.entries(itemData)) {
            let value = itemsAttr
            for (let [item, itemAttr] of Object.entries(value)) {
                let item = itemAttr

                let names = [];

                if (item.stylized) {
                    names.push(item.stylized)
                } else names.push(item);

                let items = [];
                items.push(item.emoji);

                let values = [];
                values.push(item.value);

                let descriptions = [];
                descriptions.push(item.description);

                embed.addField(
                    items + " " + names + "   " + "💰" + values.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    "`" + descriptions + "`"
                )

            }

        }
        //FIXME

        message.channel.send(embed);
    }
}