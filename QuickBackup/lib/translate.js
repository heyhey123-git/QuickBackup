const { JsonConfig } = require("./config_lib.js");
const fs = require("fs");
const path = require("path");

const languagePath = "./plugins/QuickBackup/lang/";
let defaultCN = {
    "command.description": "快速创建一个BDS存档备份",
    "initTranslation.error":
        "无法创建语言目录，这意味着本插件的某些功能可能受影响",
    "initTranslation.error.target": "目标",
    "getTranslation.error": "无法读取这样的语言文件，使用初始翻译",
    "backup.ongoing": "备份进行中，这可能需要一段较长的时间...",
    "backup.error.BDS": "BDS文件夹选取错误，没有这样的文件夹",
    "backup.error.mkdir":
        "备份目标文件夹不存在，创建这样的文件夹时失败。错误信息：",
    "logger.errMsg": "尝试进行备份失败。原因：",
    "logger.succeedMsg": "成功进行了一次备份.",
    "backup.error.occupied": "一个备份已在进行中，因此本次备份已自动取消。",
    "backup.succeed": "备份成功！备份保留天数：",
    "backup.timeout": "备份过程超时",
    "backup.error": "备份失败！错误信息：",
    "backup.copyFailed": "复制存档文件失败！错误信息：",
    "initConfig.error": "初始化配置文件失败！错误信息：",
    "getConfig.error": "读取配置文件失败！ 错误信息：",
    "createSchedule.succeed": "已成功创建一个新的任务",
    "deleteOldBackup.error.readDir":
        "删除旧的备份文件时失败，无法读取该文件夹的内容 错误信息：",
    "deleteOldBackup.error.delete":
        "删除旧的备份文件时失败，无法删除目标文件 错误信息：",
    "query.name": "名称：",
    "query.time": "执行时间；",
    "queryAll.noResult": "没有任何备份任务。",
    "query.noResult": "没有该备份任务。",
    "cancel.succeed": "取消任务成功：",
    "cancel.failed": "没有找到名字所对应的任务。",
    "scheduleFile.error": "试图读/写任务文件时失败",
    "schedule.addSucceed": "成功创建一个新的备份任务",
    "schedule.notCron": "传入的Cron表达式不合法，创建失败",
    "schedule.repetitive": "已经有一个相同名称的任务了，创建失败",
};
let defaultEN = {
    "command.description":
        "To help you with backing up your BDS archive easily.",
    "initTranslation.error":
        "It is not possible to create a language directory, which means that some features of this plugin may be affected.",
    "initTranslation.error.target": "target",
    "getTranslation.error":
        "Can't read a language file like this, now use the initial translation",
    "backup.copyFailed": "Failed to copy files! error message:",
    "backup.error.BDS": "BDS folder selection error, there is no such folder",
    "backup.error.mkdir":
        "The backup destination folder does not exist, and the creation of such a folder failed. Error message:",
    "backup.ongoing":
        "The backup is in progress, which may take a long time...",
    "backup.succeed": "Backup Success!Backup Retention Days:",
    "backup.timeout":
        "The time taken for the backup exceeds the upper limit set in the configuration file",
    "backup.error.occupied":
        "A backup is already in progress, so this backup has been automatically cancelled.",
    "backup.error": "Backup failed! Error message:",
    "logger.errMsg": "An attempt to make a backup failed. Cause:",
    "logger.succeedMsg": "A backup was successfully made.",
    "initConfig.error":
        "Failed to initialize configuration file! Error message:",
    "getConfig.error": "Failed to read the config file!",
    "createSchedule.succeed": "A new task has been successfully created",
    "deleteOldBackup.error.readDir":
        "Failed to delete the old backup file and could not read the contents of the folder. Error message:",
    "deleteOldBackup.error.delete":
        "Failed to delete old backup file and could not delete destination file. Error message:",
    "query.name": "Name:",
    "query.time": "When to execute:",
    "queryAll.noResult": "There's no any backup tasks will be execute.",
    "query.noResult": "There is no such backup task.",
    "cancel.succeed": "Cancel this task successfully:",
    "cancel.failed": "Didn't find such a task.",
    "scheduleFile.error":
        "Failed while trying to  read or write the schedule file:",

    "schedule.addSucceed": "A new backup task is created successfully.",
    "schedule.notCron":
        "The task creation failed because the incoming Cron expression was invalid",
    "schedule.repetitive":
        "Since there is already a task with the same name, the task creation fails",
};
let loggerLanguage = defaultCN;
/**
 * @type {Map<String>,<String>} 翻译Map
 */
var translationMap;

const configure = require("./config.js");
class translation {
    static init() {
        let CN = new JsonConfig(
            path.join(languagePath, "zh_CN.json"),
            defaultCN
        );
        let EN = new JsonConfig(
            path.join(languagePath, "en_US.json"),
            defaultEN
        );
        switch (configure.get("language")) {
            case "zh_CN":
                translationMap = new Map(Object.entries(CN.getData()));
                break;
            case "en_US":
                translationMap = new Map(Object.entries(EN.getData()));
                break;
            default:
                try {
                    let languageFileData = JSON.parse(
                        fs
                            .readFileSync(
                                path.join(
                                    languagePath,
                                    configure.get("language")
                                ),
                                "utf-8"
                            )
                            .toString()
                    );
                    translationMap = new Map(Object.entries(languageFileData));
                    break;
                } catch (e) {
                    logger.error(
                        loggerLanguage["getTranslation.error"] + e.toString()
                    );
                    translationMap = new Map(Object.entries(CN.getData()));
                    break;
                }
        }
    }

    /**
     *
     * @param {String} text 源文本
     * @returns {String}
     */
    static get(text) {
        let result = translationMap.get(text);
        return result;
    }
}
translation.init();

module.exports = translation;
