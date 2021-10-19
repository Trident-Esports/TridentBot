const chalk = require('chalk')
const shell = require('shelljs')

console.log(chalk.yellow("NPM Update (dry run) 🐭"))
console.log("-----------------------")
shell.exec("npm up --dry-run")
