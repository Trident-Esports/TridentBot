const fs = require('fs')
const scripts = JSON.parse(fs.readFileSync("./scripts.json","utf8"))

for (let [scriptName,scriptHelp] of Object.entries(scripts.scripts)) {
    console.log(`${scriptName}`)
    console.log("-".repeat(scriptName.length))
    for (let help of scriptHelp) {
        console.log(help)
    }
    console.log()
}
