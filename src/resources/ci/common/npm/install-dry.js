const shell = require('shelljs')

shell.echo("NPM Install")
shell.echo("-----------")
shell.exec("npm install --dry-run")
