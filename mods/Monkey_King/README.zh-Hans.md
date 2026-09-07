# 猴王传承 0.4.0 — 收录说明

作者：g1ytx。原始玩法与数值说明见 [README.md](README.md)。游戏内文本为简体中文。

## 游戏版本

请使用 **CCB 2026-09-07-2111**（Lua API 1）。该公开版本已包含
职业引用同批 Lua 变异的引擎修复 `f031320a34e7e0362c0ff98a33af42cb59ce59aa`。
原包文件名中的 requires-patched-CCB 不是说任意 API 1 游戏都兼容。
旧版 Candidate 不在本次适配范围内；不要只更新 MOD 而继续用旧引擎。

## 开始游玩

1. 在启动器安装对应游戏版本和本 MOD。
2. 创建测试新世界，启用「猴王传承」。
3. 在允许该职业的场景中搜索「花果山行者」（8点），自带全部六项传承；
   或在特质页单独选择六项变异。
4. 旧角色不会自动转职或获得新装备。

升级前备份存档；移除旧扩展 Monkey_King_Pilgrim，并清理旧目录中的
profession.json，避免重复定义。不要直接覆盖旧文件夹而保留已删除文件。

## 来源和许可

从提交者提供的 Monkey_King-0.4.0-requires-patched-CCB.zip 收录，
三个 Lua 文件和原 README 保留原内容。额外加入目录信息、双语收录说明和许可状态说明。
许可证未声明；本仓库的 MIT 许可不覆盖本 MOD。参见 [LICENSE](LICENSE)。
实际验证范围见仓库 docs/monkey-king-acceptance.md，不将注册或静态检查视为完整玩法验收。
