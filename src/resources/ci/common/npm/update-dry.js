const shell = require('shelljs')

shell.echo("NPM Update (dry run)")
shell.echo("--------------------")
shell.exec("npm update --dry-run")
