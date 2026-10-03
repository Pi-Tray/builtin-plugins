const os = require("os");

/**
 * Adds up every core's time spent idle and in total since boot.
 */
const read_cpu_times = () => {
    let idle_ms = 0;
    let total_ms = 0;

    for (const cpu of os.cpus()) {
        for (const [kind, ms] of Object.entries(cpu.times)) {
            total_ms += ms;
            if (kind === "idle") {
                idle_ms += ms;
            }
        }
    }

    return {idle_ms, total_ms};
}

module.exports.default = {
    display_name: "Show CPU usage",
    description: "Shows how busy the PC's processor is, as a percentage across all cores.",

    config_template: {
        interval_seconds: {
            type: "number",
            optional: true,
            description: "How often to update (default: 2)"
        },
        label: {
            type: "string",
            optional: true,
            description: "Text before the percentage (default: `CPU`)"
        }
    },

    live: {
        controls: ["text"],

        init({config, update, signal}) {
            const interval_ms = Math.max(500, (config.interval_seconds ?? 2) * 1000);
            const label = config.label ?? "CPU";

            // usage is the share of time that wasn't idle between two readings, a single reading is just totals since boot
            let previous = read_cpu_times();

            const timer = setInterval(() => {
                const current = read_cpu_times();
                const total_delta = current.total_ms - previous.total_ms;
                const idle_delta = current.idle_ms - previous.idle_ms;
                previous = current;

                if (total_delta <= 0) {
                    return;
                }

                const percent = Math.round(100 * (1 - idle_delta / total_delta));
                update({text: `${label} ${percent}%`});
            }, interval_ms);

            update({text: `${label} …`});
            signal.addEventListener("abort", () => clearInterval(timer));
        }
    }
}
