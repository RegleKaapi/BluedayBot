const { fileTypeFromBuffer } = require('file-type');
const fs = require("fs");
const path = require("path");

global.Page = 1
global.RandomColor = ["#FF0000", "#FF8700", "#FFD300", "#A1FF0A", "#0AFF99", "#0AEFFF", "#147DF5", "#580AFF", "#BE0AFF"]
global.DefaultColor = "#D1EFFE"

global.pickRandom = function (list) {
    return list[Math.floor(Math.random() * list.length)];
}


/**
* getBuffer hehe
* @param {fs.PathLike} PATH 
* @param {Boolean} saveToFile
*/
global.getFile = async function (PATH, fileName, saveToFile = true) {
    let res,
    filename
    const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await(res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    if (!Buffer.isBuffer(data))
        throw new TypeError('Result is not a buffer')
    const type = await fileTypeFromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
    }
    if (data && saveToFile && !filename)
        (filename = path.join(__dirname, './src/cache/' + (fileName ?? new Date * 1) + '.' + type.ext), await fs.promises.writeFile(filename, data))
    return {
        res,
        filename,
        ...type,
        data,
        deleteFile() {
            return filename && fs.promises.unlink(filename)
        }
    }
}