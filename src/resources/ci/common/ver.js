const AsciiTable = require('ascii-table')
const shell = require('shelljs')
const fs = require('fs')

let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

let data = {
    node: {
        current: shell.exec("node -v", { silent: true }).stdout.trim(),
        latest: shell.exec("npm v node version", { silent: true }).stdout.trim()
    },
    npm: {
        current: shell.exec("npm -v", { silent: true }).stdout.trim(),
        latest: shell.exec("npm v npm version", { silent: true }).stdout.trim()
    },
    [ PACKAGE.name ]: {
        current: PACKAGE.version
    }
}

const Table = new AsciiTable(`${PACKAGE.name}`, {})
    .setHeading(
        "App",
        "Current",
        "Latest"
    )
    .addRow(
        `Node`,
        `${data.node.current}`,
        `v${data.node.latest}`
    )
    .addRow(
        `NPM`,
        `v${data.npm.current}`,
        `v${data.npm.latest}`
    )
    .addRow(
        `${PACKAGE.name}`,
        `v${data[PACKAGE.name].current}`
    )
console.log(Table.toString())
