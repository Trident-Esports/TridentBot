// Load Mongo Commands from ./mongo/*.js

const fs = require('fs');

module.exports = (client) => {
    for (let srcType of [ "commands" ]) {
        // Get list of files
        const mongo_folder = `./src/mongo/${srcType}`
        const mongo_files = fs.readdirSync(mongo_folder).filter(file => file.endsWith('.js'));

        // Cycle through files
        for (const file of mongo_files) {
            // Load Command into memory
            const mongo_file = `../mongo/${srcType}/${file}`
            const command = require(mongo_file)(client);
        }
        console.log("Registered Mongo " + srcType.substr(0,1).toUpperCase() + srcType.slice(1) + '.')
    }
}
