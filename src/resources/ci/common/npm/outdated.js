const chalk = require('chalk')
const shell = require('shelljs')
require('dotenv').config()

console.log("NPM Outdated ⏰")
console.log("---------------")
const outdated = shell.exec("npm outdated", { silent: true }).stdout.trim()
if (outdated) {
    console.log(outdated)
} else {
    console.log(chalk.green("🤝  All current!"))
}
