-- Fast behavior tests with explicit fake services; not a substitute for game acceptance.
for _, id in ipairs({ "scrap_multitool", "field_journal", "pocket_alarm" }) do
    local handlers, state, contents, messages, scheduled = {}, {}, {}, {}, {}
    local choice, grants = "record", 0
    local ccb = {
        runtime = {
            handler = function(name, callback) handlers[name] = callback end,
            on = function(_, name) assert(handlers[name]) end,
        },
        state = { character = {
            get = function(key, default) if state[key] == nil then return default end return state[key] end,
            set = function(key, value) state[key] = value end,
        } },
        tasks = { after = function(turns, name, payload, version, owner)
            assert(turns == 10 and version == 1 and owner == "character")
            scheduled[#scheduled + 1] = name
        end },
        presentation = { choose = function() return choice end },
        services = {
            message = function(text) messages[#messages + 1] = text end,
            handles = { avatar = function() return "avatar" end },
            types = { id = function(kind, value) assert(kind == "item") return value end },
            inventory = { give = function(actor, item, count) assert(actor == "avatar" and count == 1) grants = grants + 1 return {ok=true} end },
            weather_snapshot = function() return {temperature_c=20} end,
        },
        content = { add = function(value) contents[#contents + 1] = value end },
    }
    local function definition(options)
        return setmetatable(options, {__index=function() return function() end end})
    end
    ccb.content.Item, ccb.content.Recipe = definition, definition
    package.loaded.ccb = ccb
    dofile("mods/" .. id .. "/main.lua")
    assert(#contents == 2)
    handlers[id .. "_ready"]({new_game=true})
    handlers[id .. "_ready"]({new_game=false})
    handlers[id .. "_ready"]({new_game=true})
    assert(grants == 1, "starter duplicated on reload")
    local context = {message=function(_, text) messages[#messages + 1] = text end}
    handlers[id .. "_use"](context)
    if id == "field_journal" then
        assert(state.observations == 1)
        choice = "weather"; handlers[id .. "_use"](context)
        assert(messages[#messages]:find("20.0"))
        choice = nil; handlers[id .. "_use"](context)
        assert(state.observations == 1)
    elseif id == "pocket_alarm" then
        handlers[id .. "_use"](context)
        assert(#scheduled == 1 and state.pending)
        handlers[scheduled[1]]()
        assert(not state.pending)
        handlers[id .. "_use"](context)
        assert(#scheduled == 2)
    end
end
print("PASS: three example behaviors, starter idempotency, journal, alarm deduplication")
