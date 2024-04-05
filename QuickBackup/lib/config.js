const { JsonConfig } = require("./config_lib.js");

const configPath = "./plugins/QuickBackup/config/config.json";
let configInit = {
    language: "zh_CN",
    BDSpath: "./worlds/Bedrock level",
    targetPath: "./backup/",
    maxRetainDays: 7,
    TimeOutSecond: 300,
    backupType: "7z",
    compressionLevel: 1,
    threads: 1,
};

/**
 * @type {Map<string>,<any>} config
 */
var config;

class configure {
    static getAll() {
        return Object.fromEntries(config.entries());
    }
    static get(key) {
        if (!config.has(key)) {
            return null;
        }
        let result = config.get(key);
        return result ? result : null;
    }
    static init() {
        let configData = new JsonConfig(configPath, configInit);
        config = new Map(Object.entries(configData.getData()));
    }
}
configure.init();

module.exports = configure;
