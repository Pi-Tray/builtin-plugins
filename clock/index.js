module.exports.default = {
    display_name: "Show the time",
    description: "Shows the current time on the button, updated live. Can also show the date.",

    config_template: {
        show_seconds: {
            type: "boolean",
            optional: true,
            description: "Show seconds as well (default: no)"
        },
        hour12: {
            type: "boolean",
            optional: true,
            description: "Use a 12-hour clock with AM/PM (default: whatever your PC's region uses)"
        },
        show_date: {
            type: "boolean",
            optional: true,
            description: "Show the date instead of the time (default: no)"
        },
        time_zone: {
            type: "string",
            optional: true,
            description: "Time zone to show, e.g. `America/New_York` (default: your PC's)"
        }
    },

    live: {
        controls: ["label"],

        init({config, update, signal}) {
            const show_seconds = config.show_seconds === true;

            // built once, formatting is much cheaper than creating a formatter every tick
            const formatter = new Intl.DateTimeFormat(undefined, {
                ...(config.show_date
                    ? {weekday: "short", day: "numeric", month: "short"}
                    : {hour: "2-digit", minute: "2-digit", ...(show_seconds ? {second: "2-digit"} : {})}),
                ...(config.hour12 !== undefined ? {hour12: config.hour12} : {}),
                ...(config.time_zone ? {timeZone: config.time_zone} : {})
            });

            // the date only changes daily and the time each minute, unless seconds are shown
            const tick_ms = config.show_date ? 60_000 : show_seconds ? 1000 : 60_000;
            let timer = null;

            const tick = () => {
                update({text: formatter.format(new Date())});

                // wait until the start of the next second or minute, so the display flips exactly on time
                timer = setTimeout(tick, tick_ms - (Date.now() % tick_ms));
            };

            tick();

            signal.addEventListener("abort", () => clearTimeout(timer));
        }
    }
}
