const shell = require('shelljs')

console.log("NPM Install (dry run)")
console.log("---------------------")
shell.exec("npm install --dry-run")
