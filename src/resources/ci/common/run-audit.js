const shell = require('shelljs')

console.log("AUDIT")
console.log("=====")

shell.exec("node ./src/resources/ci/common/ver.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/audit.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/install-dry.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/update-dry.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
