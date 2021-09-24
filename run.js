const shell = require('shelljs')

shell.exec("node ./src/resources/ci/common/ver.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/audit.js")
console.log()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")

shell.exec("node --unhandled-rejections=strict ./src/main.js")
