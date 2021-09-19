const shell = require('shelljs')
const fs = require('fs')

let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

shell.echo("Pull")
shell.echo("----")
shell.exec("node ./src/resources/ci/common/ver.js")
shell.echo()

shell.exec("git checkout main")
shell.exec("git pull origin main")
