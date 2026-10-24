const { Chalk } = require("chalk")
const chalk = new Chalk()
global.loggedErrors = new Set();

process.on('uncaughtException', err => {
    if (!global.loggedErrors.has(err)) {
        console.error(chalk.bold.red.bold('Uncaught Exception:'), err);
        global.loggedErrors.add(err);
    }
});

process.on('rejectionHandled', promise => {
    if (!global.loggedErrors.has(promise)) {
        console.error(chalk.bold.red.bold('Rejection Handled:'), promise);
        global.loggedErrors.add(promise);
    }
});

process.on('warning', warning => console.warn(chalk.bold.yellow.bold('Warning:'), warning));

process.on('unhandledRejection', (reason, promise) => {
    if (!global.loggedErrors.has(reason)) {
        console.error(chalk.bold.red.bold('Unhandled Rejection:'), reason);
        global.loggedErrors.add(reason);
    }
});

require("./function.js");
require("./bot.js");