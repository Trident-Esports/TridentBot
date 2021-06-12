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

            for(let [items, itemsAttr] of Object.entries(itemData)) {
                let value = itemsAttr
                console.log(value)
            }
            //FIXME
            //Add in Itemshop

        message.channel.send(embed);
    }
}