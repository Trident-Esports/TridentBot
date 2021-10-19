const chalk = require('chalk')
const shell = require('shelljs')

console.log(chalk.yellow("NPM Install (dry run) 🐭"))
console.log("------------------------")
let inst = shell.exec("npm i --dry-run", { silent: true })
if (inst.stdout) {
    let tmp = inst.stdout
    let tmp2 = tmp.split("\n")
    if (tmp2[0].trim() == "") {
        tmp2.shift()
    }
    console.log(tmp2.join("\n"))
}
