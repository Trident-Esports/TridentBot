const shell = require('shelljs')

shell.echo("Pull")
shell.echo("----")
shell.exec("node ./src/resources/ci/common/ver.js")
shell.echo()

shell.exec("git checkout main")
shell.exec("git pull origin main")
