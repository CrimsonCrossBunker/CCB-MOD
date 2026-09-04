# First-version acceptance / 第一版验收

2026-09-05, game `0.Ag-Candidate-2026-09-05-0219`, Lua API `1`.

- Linux graphics release: `--userdir /tmp/ccb-candidate-user/ --check-mods hello_ccb` exited 0. Create `config/` inside an isolated user directory before running this command.
- Linux terminal release: created a new world, enabled `hello_ccb`, entered the world, and opened message history. It displayed `Hello from CCB-MOD / 来自 CCB-MOD 的问候`.
- Catapult / Godot 3.6.1: the published `hello_ccb-0.1.0.zip` passed fresh installation, replacement, corrupt-ZIP preservation of the existing installation, and uninstall through ModManager. Separate tests cover game/API mismatch and rollback after a directory rename failure.
- Candidate metadata in `VERSION.txt` declares the exact tag and Lua API 1. Validation applies to this tag only, not every future build.

Linux 发布包加载检查通过；新世界已实际显示欢迎消息；公网包已完成启动器安装、更新、损坏包保留旧目录和卸载测试。
这些结果不代表已在 Windows、macOS 或 Android 完成游戏内人工验收，也不代表已经发布 Stable。
