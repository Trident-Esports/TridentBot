const shell = require('shelljs')

console.log("NPM Audit")
console.log("---------")

let debug = {
  "betterNPMAudit": {
    "exists": {
      "user": false,
      "global": false
    },
    "installed": {
      "user": false,
      "global": false
    }
  }
}

debug.betterNPMAudit.exists.global = shell
                                      .exec("npm list -g --depth 0", { silent: true })
                                      .grep("better-npm-audit")
                                      .includes("better-npm-audit")
debug.betterNPMAudit.exists.user = shell
                                      .exec("npm list --depth 0", { silent: true })
                                      .grep("better-npm-audit")
                                      .includes("better-npm-audit")

// if not global, check user
// if not user, install global
// if global fails, install user

if (!(debug.betterNPMAudit.exists.global)) {
    if (!(debug.betterNPMAudit.exists.user)) {
        console.log("Better NPM Audit not installed at user level.")
        debug.betterNPMAudit.installed.global = shell.exec("npm i -g better-npm-audit", { silent: true }).stderr.includes("npm ERR")
        if (!(debug.betterNPMAudit.exists.global)) {
            console.log("Better NPM Audit Global Install failed.")
            debug.betterNPMAudit.installed.user = shell.exec("npm i better-npm-audit", { silent: true }).stderr.includes("npm ERR")
            if (!(debug.betterNPMAudit.installed.user)) {
                console.log("Better NPM Audit User Install failed.")
            }
        }
    }
}

if (
  debug.betterNPMAudit.exists.global ||
  debug.betterNPMAudit.exists.user ||
  debug.betterNPMAudit.installed.global ||
  debug.betterNPMAudit.installed.user
  ) {
      shell.exec("better-npm-audit audit")
  }
