const fs = require('fs');

module.exports = () => {
    let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
    let DEFAULTS = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
    let DEV = GLOBALS.DEV;

    console.log("---")
    console.log(`VillainsBot v${DEFAULTS.VERSION} is Online!`);
    if(DEV) {
        console.log(`!!! DEV MODE (${GLOBALS.name}) ENABLED !!!`);
    }
    console.log('Mongoose warning about collection.ensureIndex will be thrown.');
    console.log('Ready!');
    console.log();
}
