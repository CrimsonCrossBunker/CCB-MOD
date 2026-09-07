local ccb = require("ccb")

ccb.runtime.handler("scrap_multitool_use", function(context)
    context:message("CUT 1 / HAMMER 1 / PRY 1 — use this tool through normal game actions. / 切割1、锤击1、撬动1，请通过游戏对应操作使用。")
    return 0
end, 1)

local item = ccb.content.Item {
    id = "ccb_scrap_multitool",
    name = "Scrap Multitool / 废料多用工具",
    description = "A craftable starter tool with cutting, hammering and prying qualities. A small playable Lua example, not a full content pack. / 可制作的开局工具，具备切割、锤击和撬动品质。用于实际游玩的 Lua 小示例，不是大型内容包。",
    symbol = "/",
}
item:mass_grams(350)
item:volume_ml(250)
item:price_cents(100)
item:material("steel", 1)
item:quality("CUT", 1)
item:quality("HAMMER", 1)
item:quality("PRY", 1)
item:on_use("scrap_multitool_use", "Use / 使用")
ccb.content.add(item)

local recipe = ccb.content.Recipe {
    id = "ccb_scrap_multitool",
    result = "ccb_scrap_multitool",
    category = "CC_OTHER",
    subcategory = "CSC_OTHER_OTHER",
    skill = "fabrication",
    difficulty = 0,
    duration_moves = 1000,
    autolearn = true,
}
recipe:component_any { { id = "scrap", count = 2 } }
recipe:tool_any { { id = "rock", count = 1 }, { id = "hammer", count = 1 } }
ccb.content.add(recipe)

-- Grant once per new character, never again on save reload. A failed grant
-- is reported and does not record success. The recipe remains available.
ccb.runtime.handler("scrap_multitool_ready", function(event)
    if not event.new_game or ccb.state.character.get("starter_granted", false) then
        return
    end
    local result = ccb.services.inventory.give(
        ccb.services.handles.avatar(), ccb.services.types.id("item", "ccb_scrap_multitool"), 1)
    if result.ok then
        ccb.state.character.set("starter_granted", true)
        ccb.services.message("Scrap Multitool ready. Check your inventory or the ground. / 废料多用工具已发放，请检查物品栏或脚边。")
    else
        ccb.services.message("Scrap Multitool: starter delivery failed; craft the item instead. / 开局发放失败，仍可使用配方制作。")
    end
end, 1)
ccb.runtime.on("world_ready", "scrap_multitool_ready")
