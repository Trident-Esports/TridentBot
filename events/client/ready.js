const fs = require('fs');

module.exports = () => {
    let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
    let DEV = GLOBALS.DEV;

    VERSION = "1.1.4";
    console.log("---")
    console.log(`VillainsBot v${VERSION} is Online!`);
    if(DEV) {
        console.log(`!!! DEV MODE (${GLOBALS.name}) ENABLED !!!`);
    }
    console.log('Mongoose warning about collection.ensureIndex will be thrown.');
    console.log('Ready!');
    console.log();
}
