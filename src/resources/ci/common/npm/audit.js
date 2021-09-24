const shell = require('shelljs')

shell.echo("NPM Audit")
shell.echo("---------")
shell.exec("npm audit")
