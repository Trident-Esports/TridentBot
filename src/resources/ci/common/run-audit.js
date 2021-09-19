const shell = require('shelljs')

shell.echo("AUDIT")
shell.echo("=====")

shell.exec("node ./src/resources/ci/common/ver.js")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/audit.js")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/install-dry.js")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/update-dry.js")
shell.echo()

shell.exec("node ./src/resources/ci/common/npm/outdated.js")
