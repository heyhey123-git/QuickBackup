const { scheduleJob, gracefulShutdown } = require("node-schedule");
const { parseExpression } = require("cron-parser");
const { Run } = require("./runBackup.js");
const translation = require("./translate");
const {
    writeFile,
    existsSync,
    writeFileSync,
    readFileSync,
} = require("fs");

/**
 * @type {Map<String,scheduleTask>} 包括全部任务class的列表
 */
var allSchedules = new Map();

const scheduleFile = "./plugins/QuickBackup/schedule.json";

class scheduleTask {
    /**
     *
     * @param {String} Cron cron表达式
     * @param {String} name 任务名
     */
    constructor(Cron, name) {
        if (allSchedules.has(name)) {
            return "repetitive";
        }
        try {
            parseExpression(Cron);
        } catch (e) {
            logger.error(e.toString());
            return "not a cron";
        }
        this.time = Cron;
        this.task = scheduleJob(Cron, () => {
            Run();
        });
        allSchedules.set(name, this);
        let _data = readFileSync(scheduleFile, "utf-8");
        if (!_data) {
            logger.error(translation.get("scheduleFile.error"));
        }
        let schedules = JSON.parse(_data);
        schedules[name] = Cron;
        writeFile(scheduleFile, JSON.stringify(schedules, null, "\t"), (e) => {
            if (e) {
                logger.error(
                    translation.get(scheduleFile.error) + e.toString()
                );
            }
        });
        return true
    }
    static getallSchedules = () => {
        let msg = "";
        if (allSchedules.size === 0) {
            return translation.get("queryAll.noResult");
        }
        for (let [key, value] of allSchedules) {
            msg +=
                translation.get("query.name") +
                key +
                translation.get("query.time") +
                value.time +
                "\n";
        }
        return msg;
    };
    static cancel = (name) => {
        if (allSchedules.has(name)) {
            let schedule = allSchedules.get(name);
            let res = schedule.task.cancel();
            if (res) {
                let { time } = allSchedules.get(name);
                allSchedules.delete(name);
                let _data = readFileSync(scheduleFile, "utf-8");
                if (!_data) {
                    logger.error(
                        translation.get("scheduleFile.error") + e.toString()
                    );
                    return null;
                }
                let schedules = JSON.parse(_data.toString());
                delete schedules[name];
                writeFile(
                    scheduleFile,
                    JSON.stringify(schedules, null, "\t"),
                    (e) => {
                        if (e) {
                            logger.error(
                                translation.get(scheduleFile.error) +
                                    e.toString()
                            );
                            return translation.get("cancel.failed");
                        }
                    }
                );
                return (
                    translation.get("cancel.succeed") + name + " (" + time + ")"
                );
            }
        }
        return translation.get("cancel.failed");
    };
    static cancelAll = () => {
        gracefulShutdown();
        allSchedules = new Map();
        writeFileSync(scheduleFile, "{}");
        return translation.get("cancel.succeed") + "All";
    };
    static getSchedule = (name) => {
        if (allSchedules.has(name)) {
            return (
                translation.get("query.name") +
                name +
                translation.get("query.time") +
                allSchedules.get(name).time
            );
        }
        return translation.get("query.noResult");
    };
    static init = () => {
        if (!existsSync(scheduleFile)) {
            writeFile(scheduleFile, "{}", (e) => {
                if (e) {
                    logger.error(
                        translation.get("scheduleFile.error") + e.toString()
                    );
                    return;
                }
            });
            return;
        }
        let _data = readFileSync(scheduleFile,"utf-8")
            if (!_data) {
                translation.get("scheduleFile.error");
                return;
            }
            let schedules = JSON.parse(_data.toString());
            for (let schedule in schedules) {
                new scheduleTask(schedules[schedule], schedule);
            }
    };
}
scheduleTask.init();

module.exports = scheduleTask;
