const open = require("open").default;

module.exports = {
    display_name: "Open a file or URL",

    config_template: {
        path: {
            type: "string",
            description: "The path or URL to open"
        },
        app: {
            type: "object",
            optional: true,
            description: "Optional application to open the path with",
            properties: {
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
            }
        }
    },

    handle_push: async ({config}) => {
        // must specify path
        if (!config || !config.path) {
            throw new Error("No path provided in the configuration.");
        }

        // optionally specify app object with name and optional arguments
        if (config.app) {
            if (!config.app.name) {
                throw new Error("Must provide app.name if providing app object");
            }

            if (typeof config.app.name !== "string") {
                throw new Error("app.name must be a string");
            }

            if (config.app.arguments && !Array.isArray(config.app.arguments)) {
                throw new Error("app.arguments must be an array of strings if provided");
            }

            console.log(`Opening path: ${config.path} with app: ${config.app.name} and arguments: ${config.app.arguments || []}`);

            // open the path with the specified app
            await open(config.path, {app: config.app});
        } else {
            console.log(`Opening path: ${config.path} with default application`);

            // open the path with the default app
            await open(config.path);
        }
    }
}
