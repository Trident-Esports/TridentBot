const shell = require('shelljs')

console.log("INSTALL")
console.log("=======")

shell.exec("node ./src/resources/ci/common/ver.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
console.log()

console.log("NPM Install")
console.log("-----------")
shell.exec("npm install")
console.log()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
