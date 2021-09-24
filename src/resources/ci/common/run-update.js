const shell = require('shelljs')

console.log("UPDATE")
console.log("======")

shell.exec("node ./src/resources/ci/common/ver.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
console.log()

console.log("NPM Update")
console.log("----------")
shell.exec("npm update")
console.log()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
