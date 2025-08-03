const {openApp} = require("open");

module.exports = {
    display_name: "Open an application",

    config_template: {
        name: {
            type: "string",
            description: "Name of the app to use"
        },
        arguments: {
            type: "array",
            optional: true,
            description: "Optional array of string arguments",
            items: {type: "string"}
        }
    },

    handle_push: async ({config}) => {
        // must specify name
        if (!config || !config.name) {
            throw new Error("No name provided in the configuration.");
        }

        if (typeof config.name !== "string") {
            throw new Error("name must be a string");
        }

        // optionally specify arguments
        if (config.arguments && !Array.isArray(config.arguments)) {
            throw new Error("arguments must be an array of strings if provided");
        }

        // open the path with the specified app
        await openApp(config.name, {
            arguments: config.arguments || []
        });
    }
}
