const fs = require("fs");

const configPath = "./plugins/QuickBackup/config/config.json";
let configInit = {
    language: "zh_CN",
    BDSpath: "./worlds/Bedrock level",
    targetPath: "./backup/",
    maxRetainDays: 7,
    TimeOutSecond: 300,
    backupType: "7z",
};
/**
 * @typedef {Map<string,string>} config
 */
var config;

class configure {
    static getAll() {
        return config;
    }
    static get(key) {
        if (!config.has(key)) {
            return null;
        }
        let result = config.get(key);
        return result ? result : null;
    }
    static init() {
        if (!fs.existsSync(configPath)) {
            fs.mkdir("./plugins/QuickBackup/config/", (e) => {
                config = new Map(Object.entries(configInit));
                fs.writeFile(
                    configPath,
                    JSON.stringify(configInit, null, "\t"),
                    (e) => {
                        if (e) {
                            logger.error(
                                "初始化配置文件失败！错误信息：",
                                "\nFailed to initialize configuration file! Error message:",
                                e.toString()
                            );
                        }
                    }
                );
            });
            return;
        }
        let _data = fs.readFileSync(configPath,"utf-8");
            let configNow;
            try {
                configNow = JSON.parse(_data);
            } catch (e) {
                fs.rmSync(configPath);
                initConfig();
                return;
            }
            let ChangeOrNot = false;
            for (let item in configInit) {
                if (configNow[item] === void 0) {
                    configNow[item] = configInit[item];
                    ChangeOrNot = true;
                }
            }
            config = new Map(Object.entries(configNow));
            if (ChangeOrNot === true) {
                fs.writeFileSync(
                    configPath,
                    JSON.stringify(configNow, null, "\t")
                );
            }
    }
}
configure.init();

module.exports = configure;
