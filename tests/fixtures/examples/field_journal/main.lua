local ccb = require("ccb")

ccb.runtime.handler("field_journal_use", function(context)
    local count = ccb.state.character.get("observations", 0)
    local choice = ccb.presentation.choose("Field journal / 野外观察手册 (" .. count .. ")", {
        { id = "record", label = "Record observation / 记录观察" },
        { id = "weather", label = "Read weather / 查看天气" },
        { id = "close", label = "Close / 关闭" },
    })
    if choice == "record" then
        count = count + 1
        ccb.state.character.set("observations", count)
        context:message("Field journal / 野外观察记录: " .. count)
    elseif choice == "weather" then
        local weather = ccb.services.weather_snapshot()
        context:message("Temperature / 温度: " .. string.format("%.1f C", weather.temperature_c))
    end
    return 0
end, 1)

local item = ccb.content.Item {
    id = "ccb_field_journal",
    name = "Field Journal / 野外观察手册",
    description = "An interactive notebook: read local weather and record observations with a per-character counter that survives saving and loading. / 可交互的手册：查看当地天气、记录观察次数，角色记录随存档保存和恢复。",
    symbol = "?",
}
item:mass_grams(40)
item:volume_ml(50)
item:price_cents(100)
item:material("paper", 1)
item:on_use("field_journal_use", "Use / 使用")
ccb.content.add(item)

local recipe = ccb.content.Recipe {
    id = "ccb_field_journal",
    result = "ccb_field_journal",
    category = "CC_OTHER",
    subcategory = "CSC_OTHER_OTHER",
    skill = "fabrication",
    difficulty = 0,
    duration_moves = 1000,
    autolearn = true,
}
recipe:component_any { { id = "paper", count = 1 } }
ccb.content.add(recipe)

-- Grant once per new character, never again on save reload. A failed grant
-- is reported and does not record success. The recipe remains available.
ccb.runtime.handler("field_journal_ready", function(event)
    if not event.new_game or ccb.state.character.get("starter_granted", false) then
        return
    end
    local result = ccb.services.inventory.give(
        ccb.services.handles.avatar(), ccb.services.types.id("item", "ccb_field_journal"), 1)
    if result.ok then
        ccb.state.character.set("starter_granted", true)
        ccb.services.message("Field Journal ready. Check your inventory or the ground. / 野外观察手册已发放，请检查物品栏或脚边。")
    else
        ccb.services.message("Field Journal: starter delivery failed; craft the item instead. / 开局发放失败，仍可使用配方制作。")
    end
end, 1)
ccb.runtime.on("world_ready", "field_journal_ready")
