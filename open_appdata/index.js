const { appdata } = require("../util");
const open = require("open").default;

module.exports.default = {
    display_name: "Open Pi-Tray's data directory",

    config_template: {},

    handle_push: async ({config}) => {
        const path = appdata("pi-tray/");
        console.log(`Opening path: ${path}`);
        await open(path);
    }
}
