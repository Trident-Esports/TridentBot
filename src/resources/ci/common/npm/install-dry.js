const shell = require('shelljs')

shell.echo("NPM Install (dry run)")
shell.echo("---------------------")
shell.exec("npm install --dry-run")
