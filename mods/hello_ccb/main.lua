local ccb = require("ccb")
ccb.runtime.handler("hello_ccb_world_ready", function()
    ccb.services.message("Hello from CCB-MOD / 来自 CCB-MOD 的问候")
end, 1)

ccb.runtime.on("world_ready", "hello_ccb_world_ready")
