const os = require("os");

module.exports.default = {
    display_name: "Show memory usage",
    description: "Shows how much RAM is being utilised, as a percentage of total memory.",

    config_template: {
        interval_seconds: {
            type: "number",
            optional: true,
            description: "How often to update (default: 2)"
        },
        label: {
            type: "string",
            optional: true,
            description: "Text before the percentage (default: `RAM`)"
        }
    },

    live: {
        controls: ["text"],

        init({config, update, signal}) {
            const interval_ms = Math.max(500, (config.interval_seconds ?? 2) * 1000);
            const label = config.label ?? "RAM";

            // usage is the share of time that wasn't idle between two readings, a single reading is just totals since boot
            let previous = (1 - os.freemem() / os.totalmem()) * 100;

            const timer = setInterval(() => {
                const current = (1 - os.freemem() / os.totalmem()) * 100;
                previous = current;

                const percent = Math.round(current);
                update({text: `${label} ${percent}%`});
            }, interval_ms);

            update({text: `${label} …`});
            signal.addEventListener("abort", () => clearInterval(timer));
        }
    }
}
