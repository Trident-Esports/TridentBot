const shell = require('shelljs')
const fs = require('fs')

let NPMver = shell.exec("npm --version", { silent: true }).stdout.trim()
let Nodever = shell.exec("node --version", { silent: true }).stdout.trim()
let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

let pad = `${PACKAGE.name} Version:`.length + 1

shell.echo(`${PACKAGE.name}`)
shell.echo(``.padEnd(`${PACKAGE.name}`.length,'='))
shell.echo(`Node Version:`.padEnd(pad) + `${Nodever}`)
shell.echo(`NPM Version:`.padEnd(pad) + `v${NPMver}`)
shell.echo(`${PACKAGE.name} Version:`.padEnd(pad) + `v${PACKAGE.version}`)
