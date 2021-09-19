const shell = require('shelljs')

shell.echo("NPM Update")
shell.echo("----------")
shell.exec("npm update --dry-run")
