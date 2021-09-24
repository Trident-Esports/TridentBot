const shell = require('shelljs')

console.log("NPM Audit")
console.log("---------")

let checkBetterNPMAudit = shell.exec("npm list -g --depth 0", { silent: true }).grep("better-npm-audit")
if (!(checkBetterNPMAudit.stdout.includes("better-npm-audit"))) {
    shell.exec("npm i -g better-npm-audit")
    console.log("---")
}
shell.exec("better-npm-audit audit")
