const { Run } = require("./runBackup.js");
const scheduleTask = require("./schedule.js");
const translation = require("./translate.js");
/**
 *
 * @param {Command} cmd
 * @param {CommandOrigin} ori
 * @param {CommandOutput} oupt
 * @param {any} res
 * @returns
 */
function CallBack(cmd, ori, oupt, res) {
    if (!res.action) {
        Run();
        return;
    }
    if (res.action === "query") {
        if (!res.actionName) {
            oupt.addMessage(scheduleTask.getallSchedules());
            return;
        }
        oupt.addMessage(scheduleTask.getSchedule(res.actionName));
        return;
    }
    if (res.action === "cancel") {
        if (!res.actionName) {
            oupt.addMessage(scheduleTask.cancelAll());
            return;
        }
        oupt.addMessage(scheduleTask.cancel(res.actionName));
    }
    if (res.action === "add") {
        let result = new scheduleTask(res.cronExpression, res.scheduleName);
        oupt.addMessage(
            result
                ? translation.get("schedule.addSucceed")
                : translation.get("schedule.notCron")
        );
    }
}

let cmd = mc.newCommand(
    "backup",
    translation.get("command.description"),
    PermType.Console
);
cmd.mandatory("cronExpression", ParamType.String);
cmd.mandatory("scheduleName", ParamType.String);
cmd.setEnum("actionEnum", ["query", "cancel"]);
cmd.setEnum("addEnum", ["add"]);
cmd.optional("action", ParamType.Enum, "actionEnum", 1);
cmd.optional("action", ParamType.Enum, "addEnum", 1);
cmd.optional("actionName", ParamType.String);
cmd.setCallback(CallBack);
cmd.overload(["actionEnum", "actionName"]);
cmd.overload(["addEnum", "cronExpression", "scheduleName"]);
cmd.setup();
