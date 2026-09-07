# 猴王传承 0.4.0 收录记录 / Catalog acceptance

2026-09-07，作者和维护人均为 g1ytx；由提交者提供 ZIP，源码收录在 CCB-MOD 仓库，适配人未另外署名。

## 来源与许可 / Source and license

- Original archive: Monkey_King-0.4.0-requires-patched-CCB.zip
- Original SHA-256: 5802418b5719c2a2c441ca0c9708f43622fff9eaf13e18403f8ae9d3e14e9a7c
- main.lua、mod.lua、profession.lua、原 README.md 与提供包逐字节一致。
- 增加双语收录说明和许可状态说明；提交者明确要求暂标“未声明”，未套用 MIT。
- Packaged ZIP SHA-256: 0f6a890ca14c270c5ba1c45c052e9b261c661e88cd002be362e44d746ef24559

## 兼容依据 / Compatibility basis

所需职业/同批变异引用修复：
https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/commit/f031320a34e7e0362c0ff98a33af42cb59ce59aa

已核实公开标签 **2026-09-07-2111** 包含该提交；发布包 VERSION.txt 声明 Lua API 1，
commit sha 41019e7ba10bb88925f92aa05616e3036f0965dd。
因此目录仅登记这一游戏版本，不将旧 Candidate 或全部 API 1 版本标为兼容。

## 本轮验证与边界 / Evidence and limits

- 5 项目录 Python 测试、5 项网页逻辑测试通过；只列出 Monkey_King，作者和双语搜索通过。
- 发布包结构、入口、无旧 profession.json、确定性打包以及原始内容一致性检查通过。
- 三个历史 Lua 行为测试仍通过，但仅验证迁移到 tests/fixtures/examples 的旧测试夹具，
  **不属于猴王 MOD 的玩法验证**。
- 官方 Linux 终端版执行 `--userdir /tmp/ccb-monkey-user/ --check-mods Monkey_King`，
  在 90 秒限时内未完成，exit 124；日志停在初始化/翻译扫描阶段，尚无 MOD 通过结论。
  不据此断言 MOD 有错误，也不把包含所需引擎修复当成运行验收。
- **目录 validation 保留 not-tested，日期和验证版本为 null。**
- 未完成本轮职业创建、六项数值效果、存读档或跨平台游玩验收。

The required engine fix is present in the listed release, but this is not a gameplay PASS.
The bounded native loading attempt did not finish. Validation remains not-tested.

## 旧示例下架 / Delisting

hello_ccb、field_journal、pocket_alarm、scrap_multitool 不再进入生成目录或发布包。
源码移到 tests/fixtures/examples，只供离线回归；Git 历史和历史验收记录保留。
此次不删除任何玩家本地 MOD 或存档。
