const archieve = require("node-7z-threetwo");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const configure = require("./config");
const translation = require("./translate");
/**
 * @type {Boolean} 安全性检查，为true时不会进行备份
 */
var safetyCheck = false;

const logFile = "./logs/backupLog.log";
function writeLog(result, errMsg) {
    let date = new Date();
    fs.access(logFile, (e) => {
        if (e) {
            fs.writeFileSync(logFile, "");
        }
        let text = `\n[${date.toLocaleString()}] ${translation.get(
            result ? "logger.succeedMsg" : "logger.errMsg"
        )} ${errMsg ? errMsg : ""}`;
        fs.appendFileSync(logFile, text, { encoding: "utf-8" });
    });
}

module.exports.Run = () => {
    if (safetyCheck) {
        logger.error(translation.get("backup.error.occupied"));
        return;
    }
    safetyCheck = true;
    let conf = configure.getAll();
    let BDSpath = configure.get("BDSpath");
    if (!fs.existsSync(BDSpath)) {
        logger.error(translation.get("backup.error.BDS"));
        safetyCheck = false;
        return;
    }
    let date = new Date();
    let {
        maxRetainDays,
        backupType,
        TimeOutSecond,
        targetPath,
        compressionLevel,
        threads,
    } = conf;
    if (!fs.existsSync(targetPath)) {
        try {
            fs.mkdir(targetPath, { recursive: true }, (e) => {
                if (e) {
                    throw e;
                }
            });
        } catch (e) {
            writeLog(false, e.toString());
            logger.error(translation.get("backup.error.mkdir") + e.toString());
            safetyCheck = false;
            return;
        }
    }
    mc.runcmd("save hold");
    logger.info(translation.get("backup.ongoing"));
    let temp = path.resolve(
        targetPath,
        "Bedrock_level" +
            date
                .toLocaleString()
                .replace(/ /g, "")
                .replace(/\//g, "")
                .replace(/:/g, "")
    );
    fse.copy(BDSpath, temp)
        .then((value) => {
            Promise.race([
                new Promise((resolve, reject) => {
                        archieve
                            .add(path.resolve(temp + "." + backupType), temp, {
                                t: backupType,
                                mx: "=" + compressionLevel,
                                mmt: "=" + threads,
                            })
                        .then((value) => {
                            writeLog(true, null);
                            logger.info(
                                translation.get("backup.succeed") +
                                    maxRetainDays
                            );
                            resolve();
                        })
                        .catch((e) => {
                            writeLog(false, e.toString());
                            logger.error(
                                translation.get("backup.error") + e.toString()
                            );
                            reject(e);
                        })
                        .finally(() => {
                            mc.runcmd("save resume");
                            fs.rmSync(temp, { recursive: true });
                            safetyCheck = false;
                        });
                }).then((value) => {
                    fs.readdir(
                        targetPath,
                        { encoding: "utf-8" },
                        (e, files) => {
                            if (e) {
                                writeLog(false, e.toString());
                                logger.error(
                                    translation.get(
                                        "deleteOldBackup.error.readDir"
                                    ) + e.toString()
                                );
                                return;
                            }
                            for (let file of files) {
                                if (!file.includes(backupType)) {
                                    continue;
                                }
                                fs.stat(targetPath, (e, stats) => {
                                    let fileDate = new Date(stats.birthtimeMs);
                                    if (
                                        date - fileDate >
                                        maxRetainDays * 86400000
                                    ) {
                                        fs.rm(path.join(targetPath , file), (e) => {
                                            if (e) {
                                                writeLog(false, e.toString());
                                                logger.error(
                                                    translation.get(
                                                        "deleteOldBackup.error.delete"
                                                    ) + e.toString()
                                                );
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    );
                }),
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject("timeout");
                    }, TimeOutSecond * 1000);
                }),
            ])
                .then((value) => {
                    if (maxRetainDays === -1) {
                        return;
                    }
                    fs.readdir(
                        targetPath,
                        { encoding: "utf-8" },
                        (e, files) => {
                            if (e) {
                                writeLog(false, e.toString());
                                logger.error(
                                    translation.get(
                                        "deleteOldBackup.error.readDir"
                                    ) + e.toString()
                                );
                                return;
                            }
                            for (let file of files) {
                                if (!file.includes(backupType)) {
                                    continue;
                                }
                                fs.stat(targetPath, (e, stats) => {
                                    let fileDate = new Date(stats.birthtimeMs);
                                    if (
                                        date - fileDate >
                                        maxRetainDays * 86400000
                                    ) {
                                        fs.rm(path.join(target + file), (e) => {
                                            if (e) {
                                                writeLog(false, e.toString());
                                                logger.error(
                                                    translation.get(
                                                        "deleteOldBackup.error.delete"
                                                    ) + e.toString()
                                                );
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    );
                })
                .catch((e) => {
                    if (e === "timeout") {
                        logger.error(translation.get("backup.timeout"));
                    }
                });
        })
        .catch((e) => {
            logger.error(translation.get(""));
            writeLog(false, e.toSting());
        });
};
