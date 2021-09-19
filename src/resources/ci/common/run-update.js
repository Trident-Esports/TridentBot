const shell = require('shelljs')

shell.echo("UPDATE")
shell.echo("======")

shell.exec("node ./src/resources/ci/common/ver.js")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
shell.echo()

shell.echo("NPM Update")
shell.echo("----------")
shell.exec("npm update")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
