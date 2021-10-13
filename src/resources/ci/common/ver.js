const AsciiTable = require('ascii-table')
const semver = require('semver')
const shell = require('shelljs')
const fs = require('fs')

let PACKAGE = JSON.parse(fs.readFileSync("./package.json", "utf8"))

let data = {}
for(let module of [ "node", "npm", "discord.js" ]) {
    data[module] = {}
    data[module].current = ""
    if ([ "node", "npm" ].includes(module)) {
        data[module].current = shell.exec(`${module} -v`, { silent: true }).stdout.trim()
    } else {
        let tmp = shell.exec(
            `npm list ${module} --depth=0` + ' | ' +
            `grep -Po '${module}@(.*)$'`,
            { silent: true }
        ).stdout.trim()
        data[module].current = shell.exec(
            `echo ${tmp}` + ' | ' +
            `cut -c ${tmp.indexOf('@') + 2}-${tmp.length}`,
            { silent: true}
        ).stdout.trim()
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
    Table.addRow(
        mName,
        (
            (
                data[module].current.charAt(0).toLowerCase() == 'v' ?
                "" :
                'v'
            ) +
            data[module].current
        ),
        (
            data[module]?.latest ?
            (
                (
                    data[module].latest.charAt(0).toLowerCase() == 'v' ?
                    "" :
                    'v'
                ) +
                data[module].latest
            )
            : ""
        )
    )
}
console.log(Table.toString())

Table = new AsciiTable("Functionality", {})
Table.addRow(
    "Pagination",
    semver.lt(data["discord.js"].current, "13.0.0") ? "🟩" : "🟥"
)
.addRow(
    "Collectors",
    semver.lt(data["discord.js"].current, "13.0.0") ? "🟩" : "🟥"
)
console.log(Table.toString())
