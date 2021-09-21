const shell = require('shelljs')

shell.exec("node ./src/resources/ci/common/ver.js")
shell.echo()

// shell.exec("node ./src/resources/ci/common/npm/audit.js")
// shell.echo()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")

shell.exec("node --unhandled-rejections=strict ./src/main.js")
