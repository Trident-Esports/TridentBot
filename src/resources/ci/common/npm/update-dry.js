const shell = require('shelljs')

console.log("NPM Update (dry run)")
console.log("--------------------")
shell.exec("npm up --dry-run")
