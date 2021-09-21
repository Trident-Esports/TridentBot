const shell = require('shelljs')

shell.echo("NPM Audit")
shell.echo("---------")
try {
    shell.exec("better-npm-audit audit")
} catch {
    shell.exec("npm audit")
}
