const { scheduleJob, gracefulShutdown } = require("node-schedule");
const { parseExpression } = require("cron-parser");
const { Run } = require("./runBackup.js");
const translation = require("./translate");
const { JsonConfig } = require("./config_lib.js");
const { writeFileSync } = require("fs");
const scheduleFile = "./plugins/QuickBackup/schedule.json";

/**
 * @type {JsonConfig}
 */
var scheduleData;
/**
 * @type {Map<String,scheduleTask>} 包括全部任务class的列表
 */
var allSchedules;

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
        if (!scheduleData.get(name)) {
            scheduleData.set(name, Cron);
        }
        return true;
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
                scheduleData.delete(name);
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
        scheduleData = new JsonConfig(scheduleFile, {});
        allSchedules = new Map();
        let scheduleObj = scheduleData.getData();
        for (let name in scheduleObj) {
            allSchedules.set(name, new scheduleTask(scheduleObj[name], name));
        }
    };
}
scheduleTask.init();

module.exports = scheduleTask;
