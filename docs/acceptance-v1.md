# First-version acceptance / 第一版验收

2026-09-05, game `0.Ag-Candidate-2026-09-05-0219`, Lua API `1`.

- Linux graphics release: `--userdir /tmp/ccb-candidate-user/ --check-mods hello_ccb` exited 0. Create `config/` inside an isolated user directory before running this command.
- Linux terminal release: created a new world, enabled `hello_ccb`, entered the world, and opened message history. It displayed `Hello from CCB-MOD / 来自 CCB-MOD 的问候`.
- Catapult / Godot 3.6.1: the published `hello_ccb-0.1.0.zip` passed fresh installation, replacement, corrupt-ZIP preservation of the existing installation, and uninstall through ModManager. Separate tests cover game/API mismatch and rollback after a directory rename failure.
- Candidate metadata in `VERSION.txt` declares the exact tag and Lua API 1. Validation applies to this tag only, not every future build.

Linux 发布包加载检查通过；新世界已实际显示欢迎消息；公网包已完成启动器安装、更新、损坏包保留旧目录和卸载测试。
这些结果不代表已在 Windows、macOS 或 Android 完成游戏内人工验收，也不代表已经发布 Stable。

## Catalog and playable examples follow-up / 目录与可玩示例补充验收

2026-09-05, same Candidate and Lua API 1; Catapult v1.2.0-ccb.

- CCB-MOD: 5 Python tests, 5 Node tests and three Lua behavior-fixture checks passed. Deterministic packages include entrypoints, both READMEs and MIT licenses.
- Site generator creates a community entry, downloads JSON-as-YAML and constructs a GitHub issue draft URL. Tests cover multilingual search, both types, malformed links/IDs/versions, and JSON-only entries. No fake application was posted and no fictitious community entry was published.
- Actual published Linux launcher code (loaded from the v1.2.0-ccb package in Godot 3.6.1) installed and discovered all four ZIPs. A test-only community classification exercises the same installer; the public catalog correctly lists the examples as CCB-maintained.
- Linux graphics Candidate: `--userdir /tmp/ccb-godot3/ccb/userdata/ --check-mods field_journal pocket_alarm scrap_multitool hello_ccb` exited 0, with no ERROR in debug.log. IDs are separate arguments, not comma-separated.
- Linux terminal Candidate: created world **Hammond**, enabled the three new MODs alongside dda and defaults, accepted the explicit Lua trust prompt, and created **Noble 'Jarocho' Alley**. Each new item was delivered and appeared in the activation list.
- Field Journal: recorded observation 1; saved and reloaded; the menu still showed 1. Weather action printed 8.3 C from the live weather service.
- Pocket Reminder: scheduled before saving. The character save held a named task and pending=true; after reload and advancing turns, the message `Pocket reminder: ten turns have passed. / 口袋提醒器：十回合已到。` appeared. Final save has pending=false and no remaining task.
- Scrap Multitool: real activation exposed normal write/cut actions plus its custom Use action; custom action reported CUT 1 / HAMMER 1 / PRY 1. All three native recipes passed game data loading; manual crafting from gathered ingredients was not separately completed.
- Startup grant flags remained true after reload and each item appeared once. Lua unit fixtures additionally check duplicate grant prevention and pending-alarm deduplication.

Scope: real game testing was on Linux. This is not a claim of Windows/macOS/Android gameplay acceptance, long-run balance testing, a security audit, or complete Lua API parity. Website checks here are static/logic tests, not browser click automation. Launcher tests invoke the shipped installer, not GUI clicking.

基线与验证范围严格如上。示例是本仓库原创的教学小 MOD，不是假装已有民间作者投稿。申请与更新仍人工审核、人工主站部署。
