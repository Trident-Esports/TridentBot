const AsciiTable = require('ascii-table')
const semver = require('semver')
const chalk = require('chalk')
const shell = require('shelljs')
const fs = require('fs')

let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

let data = {}
for(let module of [ "node", "npm", "discord.js", "@sapphire/framework" ]) {
    data[module] = {}
    data[module].current = ""
    if ([ "node", "npm" ].includes(module)) {
        data[module].current = shell.exec(`${module} -v`, { silent: true }).stdout.trim()
    } else {
        let tmp = shell.exec(
            `npm list ${module} --depth=0`,
            { silent: true }
        ).grep(`${module}@(.*)$`)
        data[module].current = tmp.stdout.slice(tmp.lastIndexOf('@') + 1).trim()
    }
    data[module].latest = shell.exec(`npm v ${module} version`, { silent: true }).stdout.trim()
}
data[ PACKAGE.name ] = { current: `${PACKAGE.version}` }

let Table = new AsciiTable(`🔱 ${PACKAGE.name} 🔱`, {})
    .setHeading(
        "App",
        "Current",
        "Latest"
    )
for(let [module, mData] of Object.entries(data)) {
    let mName = module
    if (mName == "npm") {
        mName = mName.toUpperCase()
    } else {
        mName = mName.charAt(0).toUpperCase() + mName.slice(1)
    }
    let cur = data[module].current
    let lat = data[module].latest

    if (cur && cur.charAt(0).toLowerCase() !== 'v') {
        cur = `v${cur}`
    }
    if (lat && lat.charAt(0).toLowerCase() !== 'v') {
        lat = `v${lat}`
    }

    Table.addRow(
        mName,
        cur,
        lat
    )
}
console.log(Table.toString())

Table = new AsciiTable("Functionality", {})
for (let func of ["Pagination","Collectors"]) {
    let validVer = semver.lt(data["discord.js"].current, "13.0.0")
    Table.addRow(
        func,
        validVer ? "🟩" : "🟥"
    )
}
console.log(Table.toString())
