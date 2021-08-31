const { spawn } = require("child_process")

// alias spawn
const exec = async (commands) => {
    if (!(Array.isArray(commands))) {
        commands = [commands]
    }
    for (let command of commands) {
        spawn(command, { stdio: "inherit", shell: true });
    }
}

// use like this
exec(
    [
        "npm run test"
    ]
)
