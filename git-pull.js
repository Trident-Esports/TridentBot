const shell = require('shelljs')
const fs = require('fs')
let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

shell.echo("GIT PULL")
shell.echo("========")

shell.exec("node ./src/resources/ci/common/ver.js")
shell.echo()

shell.exec("node ./src/resources/ci/common/git/pull.js")
shell.echo()

shell.echo(`Remember to reset ${PACKAGE.name} by running 'sh' in Discord!`)
shell.echo()
