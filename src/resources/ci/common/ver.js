const shell = require('shelljs')
const fs = require('fs')

let NPMver = shell.exec("npm --version", { silent: true }).stdout.trim()
let Nodever = shell.exec("node --version", { silent: true }).stdout.trim()
let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

let pad = `${PACKAGE.name} Version:`.length + 1

console.log(`${PACKAGE.name}`)
console.log(``.padEnd(`${PACKAGE.name}`.length,'='))
console.log(`Node Version:`.padEnd(pad) + `${Nodever}`)
console.log(`NPM Version:`.padEnd(pad) + `v${NPMver}`)
console.log(`${PACKAGE.name} Version:`.padEnd(pad) + `v${PACKAGE.version}`)
