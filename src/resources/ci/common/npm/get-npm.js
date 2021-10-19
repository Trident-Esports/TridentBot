const shell = require('shelljs')
const os = require('os')

console.log("Update NPM 🔨")
console.log("-------------")
if(os.platform().toLowerCase().includes("linux")) {
  // shell.exec("sudo npm i -g npm@latest")
  shell.exec("sudo npm i npm@latest")
} else {
  // shell.exec("npm i -g npm@latest")
  shell.exec("npm i npm@latest")
}
