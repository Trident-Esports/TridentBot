const shell = require('shelljs')

shell.echo("INSTALL")
shell.echo("=======")

shell.exec("node ./src/resources/ci/common/ver.js")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
shell.echo()

shell.echo("NPM Install")
shell.echo("-----------")
shell.exec("npm install")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
