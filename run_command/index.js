const {exec} = require("child_process");

module.exports.default = {
    display_name: "Run a console command",

    config_template: {
        command: {
            type: "string",
            description: "The command to run",
        },
    },

    handle_push: async ({config}) => {
        // must specify command
        if (!config || !config.command) {
            throw new Error("No command provided in the configuration.");
        }

        if (typeof config.command !== "string") {
            throw new Error("command must be a string");
        }

        // run the command
        return new Promise((resolve, reject) => {
            console.log(`Executing command: ${config.command}`);

            exec(config.command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error executing command: ${error.message}`);
                } else if (stderr) {
                    console.error(`Command stderr: ${stderr}`);
                    resolve(stderr);
                } else {
                    console.log(`Command stdout: ${stdout}`);
                    resolve(stdout);
                }
            });
        });
    }
}
