/*

Branded Slim Generic Embed Handler

MessageEmbed
 VillainsEmbed
  SlimEmbed

*/
const VillainsEmbed = require('./vembed.class');

module.exports = class SlimEmbed extends VillainsEmbed {
    constructor(props = {}) {
        if(props?.title?.text && props.title.text.trim() != "" && props.title.text.trim() != "<NONE>") {
            if(!(props?.description)) {
                props.description = ""
            }
            if(Array.isArray(props.description)) {
                props.description = props.description.join("\n")
            }
            props.description = "***" + props.title.text + "***" + "\n" + props.description
        }
        props.title = { text: "<NONE>" }
        props.thumbnail = "<NONE>"
        props.footer = { msg: "<NONE>" }
        props.timestamp = false

        super(
            {...props}
        )
    }
}
