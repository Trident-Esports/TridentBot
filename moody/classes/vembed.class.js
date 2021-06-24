const fs = require('fs');
const { MessageEmbed } = require('discord.js');

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV

module.exports = class VillainsEmbed extends MessageEmbed {
    constructor(props = {}) {
        if (
          (
            (!props?.title?.text) ||
            (props?.title?.text && props.title.text.trim() == "")
          ) &&
          (props?.title?.url && props.title.url.trim() != "")
        ) {
            props.title.text = "Source"
        }
        if ((!props?.thumbnail) || (props?.thumbnail && props.thumbnail.trim() == "")) {
            props.thumbnail = defaults.thumbnail
        }
        if ((!props?.description) || (props?.description && props.description.trim() == "")) {
            props.description = "** **"
        }

        if ((!props?.color) || (props?.color && props.color.trim() == "")) {
            switch (props.color) {
                default:
                    props.color = defaults.stripe;
                    break;
            }
        } else {
            props.color = defaults.stripe;
        }

        // Hack in my stuff to differentiate
        if (DEV) {
            props.color = GLOBALS["stripe"]
            props.footer = GLOBALS.footer
        } else if(!props?.footer) {
            props.footer = defaults.footer
        }

        // ERROR
        if (props?.title?.text && props.title.text.toLowerCase().indexOf("error") > -1) {
            props.color = "#ff0000" // RED
        }

        super({
            color: props.color,
            description: "Something got stuffed up here..."
        })

        // Footer
        if((!props?.pages) || (!props.pages)) {
            this.setFooter(props.footer.msg, props.footer.image)
        } else {
            if(props.description != "") {
                props.description += "\n\n"
            }
            props.description += props.footer.msg
        }

        // Stripe
        this.setColor(props.color)

        // Author
        if(props.thumbnail != defaults.thumbnail) {
            // Author:    NO
            // Title:     Y/N
            // URL:       Y/N
            // Thumbnail: YES
            // Hijack author spot to have default Thumbnail
            this.setAuthor(
                props?.title?.text && props.title.text.trim() != "" ? props.title.text : "",
                defaults.thumbnail,
                props?.title?.url && props.title.url.trim() != "" ? props.title.url : ""
            )
        } else {
            if(props?.author?.name && props.author.name.trim() != "") {
                // Author: YES
                this.setAuthor(props.author.name, props.author.avatar, props.author.url)
            }
            // Title:  Y/N
            // URL:    Y/N
            if(props?.title?.text && props.title.text.trim() != "") {
                this.setTitle("***" + props.title.text + "***")
            }
            if(props?.title?.url && props.title.url.trim() != "") {
                this.setURL(props.title.url)
            }
        }

        // Thumbnail
        this.setThumbnail(props.thumbnail)

        // Body Description
        this.setDescription(props.description)

        // Fields
        if (props?.fields?.length) {
            for (let field of props.fields) {
                let fName = field?.name ? field.name : ""
                let fVal = field?.value ? field.value : ""
                let fInl = field?.inline ? field.inline : false
                this.addField(fName, fVal, fInl)
            }
        }

        // Body Image
        if (props?.image != "") {
            this.setImage(props.image)
        }

        // Timestamp
        this.setTimestamp()
    }
}
