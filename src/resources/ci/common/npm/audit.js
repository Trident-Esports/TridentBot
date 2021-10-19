const chalk = require('chalk')
const shell = require('shelljs')
const fs = require('fs')

console.log("NPM Audit 💊")
console.log("------------")

let checkGlobalBetterNPMAudit = shell.exec("npm list -g --depth 0", { silent: true }).grep("better-npm-audit")
let checkLocalBetterNPMAudit = shell.exec("npm list --depth 0", { silent: true }).grep("better-npm-audit")
if (
      (
          !(checkGlobalBetterNPMAudit.stdout.includes("better-npm-audit"))
      ) &&
      (
          !(checkLocalBetterNPMAudit.stdout.includes("better-npm-audit"))
      )
  ) {
    // shell.exec("npm i -g better-npm-audit")
    shell.exec("npm i better-npm-audit")
    console.log("---")
}

let audit = shell.exec(`better-npm-audit audit`, { silent: true}).stdout.trim()
if (audit.includes("🤝")) {
    audit = chalk.green(audit)
}
console.log(audit)
