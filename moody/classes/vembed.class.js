const fs = require('fs');
const { MessageEmbed } = require('discord.js');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV

module.exports = class VillainsEmbed extends MessageEmbed {
    constructor(
        color = "",
        author = {
            name: "",
            avatar: "",
            url: ""
        },
        thumbnail = "",
        title = {
            text: "",
            url: ""
        },
        description = "",
        fields = {},
        image = "",
        footer = defaults.footer,
        pages = false
    ) {
        if (title?.text && title.text.trim() == "" && title?.url && title.url.trim() != "") {
            title.text = "Source"
        }
        if (thumbnail.trim() == "") {
            thumbnail = defaults.thumbnail
        }
        if (description.trim() == "") {
            description = "** **"
        }

        if (color.trim() == "") {
            switch (color) {
                default:
                    color = defaults.stripe;
                    break;
            }
        }

        // Hack in my stuff to differentiate
        if (DEV) {
            color = GLOBALS["stripe"]
            footer = GLOBALS.footer
        }

        super({
            color: color,
            description: "Something got stuffed up here..."
        })

        // Footer
        if(!pages) {
            this.setFooter(footer.msg, footer.image)
        } else {
            if(description != "") {
                description += "\n\n"
            }
            description += footer.msg
        }

        // Stripe
        this.setColor(color)

        // Author
        if(thumbnail != defaults.thumbnail) {
            // Author:    NO
            // Title:     Y/N
            // URL:       Y/N
            // Thumbnail: YES
            // Hijack author spot to have default Thumbnail
            this.setAuthor(
                title?.text && title.text.trim() != "" ? title.text : "",
                defaults.thumbnail,
                title?.url && title.url.trim() != "" ? title.url : ""
            )
        } else {
            if(author?.name && author.name.trim() != "") {
                // Author: YES
                this.setAuthor(author.name, author.avatar, author.url)
            }
            // Title:  Y/N
            // URL:    Y/N
            if(title?.text && title.text.trim() != "") {
                this.setTitle("***" + title.text + "***")
            }
            if(title?.url && title.url.trim() != "") {
                this.setURL(title.url)
            }
        }

        // Thumbnail
        this.setThumbnail(thumbnail)

        // Body Description
        this.setDescription(description)

        // Fields
        if (fields.length) {
            for (let field of fields) {
                let fName = field?.name ? field.name : ""
                let fVal = field?.value ? field.value : ""
                let fInl = field?.inline ? field.inline : false
                this.addField(fName, fVal, fInl)
            }
        }

        // Body Image
        if (image != "") {
            this.setImage(image)
        }

        // Timestamp
        this.setTimestamp()
    }
}
