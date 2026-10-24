const { existsSync, readdirSync, statSync } = require("fs");
const { join, extname } = require("path");
const path = require("path");
const { fileURLToPath } = require("url");

module.exports.fileReader = (dir) => {
    //dir = fileURLToPath(dir);
    dir = path.resolve(dir)
    if (!existsSync(dir)) return [];
    const files = [];
    const directoryData = readdirSync(dir);

    for (const file of directoryData) {
        const filePath = join(dir, file);
        const stats = statSync(filePath);

        if (stats.isFile() && extname(filePath) === ".js") files.push(filePath);
        else if (stats.isDirectory()) files.push(...fileReader(`file:///${filePath}`));
    };

    return files;
};