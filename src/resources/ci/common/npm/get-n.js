const shell = require('shelljs')
const os = require('os')

console.log("Update Node 🔨")
console.log("--------------")
if(os.platform().toLowerCase().includes("linux")) {
    shell.exec("sudo npm i -g n@latest")
    shell.exec('sudo -E env "PATH=$PATH" n latest')
} else {
    console.log("Node needs to be updated a different way." + "\n" + "Visit http://nodejs.org .")
}
