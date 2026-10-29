const open = require("open").default;

module.exports.default = {
    display_name: "Open Pi-Tray Editor",

    handle_push: async ({config}) => {
        console.log("Opening editor");
        await open("pi-tray-editor://");
    }
}
