local ccb = require("ccb")

ccb.runtime.handler("pocket_alarm_ring", function()
    ccb.state.character.set("pending", false)
    ccb.services.message("Pocket reminder: ten turns have passed. / 口袋提醒器：十回合已到。")
end, 1)

ccb.runtime.handler("pocket_alarm_use", function(context)
    if ccb.state.character.get("pending", false) then
        context:message("A reminder is already pending. / 已有一个提醒正在等待。")
        return 0
    end
    ccb.tasks.after(10, "pocket_alarm_ring", {}, 1, "character")
    ccb.state.character.set("pending", true)
    context:message("Reminder set for ten turns. / 已预约十回合后的提醒。")
    return 0
end, 1)

local item = ccb.content.Item {
    id = "ccb_pocket_alarm",
    name = "Pocket Reminder / 口袋提醒器",
    description = "A reusable ten-turn reminder demonstrating item activation, persistent character tasks and duplicate-scheduling prevention. / 可重复使用的十回合提醒器，展示物品交互、角色持久化任务和重复预约防护。",
    symbol = ";",
}
item:mass_grams(80)
item:volume_ml(50)
item:price_cents(100)
item:material("steel", 1)
item:on_use("pocket_alarm_use", "Use / 使用")
ccb.content.add(item)

local recipe = ccb.content.Recipe {
    id = "ccb_pocket_alarm",
    result = "ccb_pocket_alarm",
    category = "CC_OTHER",
    subcategory = "CSC_OTHER_OTHER",
    skill = "fabrication",
    difficulty = 0,
    duration_moves = 1000,
    autolearn = true,
}
recipe:component_any { { id = "scrap", count = 1 } }
recipe:tool_any { { id = "rock", count = 1 }, { id = "hammer", count = 1 } }
ccb.content.add(recipe)

-- Grant once per new character, never again on save reload. A failed grant
-- is reported and does not record success. The recipe remains available.
ccb.runtime.handler("pocket_alarm_ready", function(event)
    if not event.new_game or ccb.state.character.get("starter_granted", false) then
        return
    end
    local result = ccb.services.inventory.give(
        ccb.services.handles.avatar(), ccb.services.types.id("item", "ccb_pocket_alarm"), 1)
    if result.ok then
        ccb.state.character.set("starter_granted", true)
        ccb.services.message("Pocket Reminder ready. Check your inventory or the ground. / 口袋提醒器已发放，请检查物品栏或脚边。")
    else
        ccb.services.message("Pocket Reminder: starter delivery failed; craft the item instead. / 开局发放失败，仍可使用配方制作。")
    end
end, 1)
ccb.runtime.on("world_ready", "pocket_alarm_ready")
