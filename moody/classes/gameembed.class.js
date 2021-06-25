const VillainsEmbed = require('./vembed.class');

module.exports = class GameEmbed extends VillainsEmbed {
    constructor(props = {}) {
        if(props?.title?.text && props.title.text.trim() != "") {
            if(!props?.description) {
                props.description = ""
            }
            props.description = "***" + props.title.text + "***" + "\n" + props.description
        }
        props.title = { text: "<NONE>" }
        props.thumbnail = "<NONE>"
        props.footer = { msg: "<NONE>" }
        props.timestamp = false

        super(props)
    }
}
