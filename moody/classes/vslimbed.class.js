const fs = require('fs');
const VillainsEmbed = require('./vembed.class');

module.exports = class SlimEmbed extends VillainsEmbed {
    constructor(props = {}) {
        props.title = { text: "<NONE>" }
        props.thumbnail = "<NONE>"
        props.footer = { msg: "<NONE>" }
        props.timestamp = false

        super(props)
    }
}
