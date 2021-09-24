const shell = require('shelljs')

shell.echo("NPM Outdated")
shell.echo("------------")
shell.exec("npm outdated")
