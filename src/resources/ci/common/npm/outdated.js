const shell = require('shelljs')

console.log("NPM Outdated ⏰")
console.log("---------------")
const outdated = shell.exec("npm outdated", { silent: true }).stdout.trim()
if (outdated) {
    console.log(outdated)
} else {
    console.log("🤝  All current!")
}
