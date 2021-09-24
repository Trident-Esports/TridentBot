const shell = require('shelljs')
const os = require('os')

console.log("Update NPM")
console.log("----------")
if(os.platform().toLowerCase().includes("linux")) {
    shell.exec("sudo npm i -g npm@latest")
} else {
    console.log("NPM needs to be updated a different way")
}
