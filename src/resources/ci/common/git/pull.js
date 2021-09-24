const shell = require('shelljs')

console.log("Pull")
console.log("----")
shell.exec("node ./src/resources/ci/common/ver.js")
console.log()

shell.exec("git checkout main")
shell.exec("git pull origin main")
