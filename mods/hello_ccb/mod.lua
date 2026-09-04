local ccb = require("ccb")
return ccb.ModDefinition {
    id = "hello_ccb",
    name = "CCB Lua Welcome Example",
    version = "0.1.0",
    dependencies = { "dda" },
}
