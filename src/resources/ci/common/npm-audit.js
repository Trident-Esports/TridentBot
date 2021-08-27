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
        "npm audit",
        "npm install --dry-run",
        "npm update --dry-run",
        "npm outdated"
    ]
)
