const chalk = require('chalk')
const shell = require('shelljs')
const fs = require('fs')
let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

console.log("GIT PULL")
console.log("========")

shell.exec("node ./src/resources/ci/common/ver.js")
console.log()

shell.exec("node ./src/resources/ci/common/git/pull.js")
console.log()

console.log(chalk.red(`Remember to restart ${PACKAGE.name} by running 'sh' in Discord!`))
console.log()
