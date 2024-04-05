mc.listen("onServerStarted", () => {
    require("./lib/config.js");
    require("./lib/translate.js");
    require("./lib/schedule.js");
    require("./lib/cmdRegister.js");
});
