# MOD 目录 API / Catalog API

公开只读入口 / Public read-only endpoints:

- [mods.json](https://crimsoncrossbunker.github.io/CCB-MOD/mods.json)
- [Schema v1](../schemas/mod-v1.schema.json)
- [登记入口 / Submission form](https://crimsoncrossbunker.github.io/CCB-MOD/submit.html)

这是 GitHub Pages 上的静态 JSON，不是运行游戏 Lua 的 API，也没有在线写入 API。
无需登录或令牌；网站与 Catapult 读取同一份数据。顶层 `schema_version: 1`，条目在 `mods`。
`generated_at` 是登记更新时间生成的确定性字段，不代表在线探活或最后构建时间。

This is static JSON on GitHub Pages, not the game's Lua API. No authentication or write endpoint is provided.
The website and Catapult consume the same `mods` array under `schema_version: 1`.
`generated_at` is deterministic metadata derived from entry update dates, not a health check or last deployment timestamp.

| 字段 / Field | 含义 / Meaning |
| --- | --- |
| `id`, `version` | 稳定 MOD ID 与包版本 / Stable MOD ID and package version |
| `type` | `ccb-maintained` 仓库维护；`community` 作者仓库维护 / Maintained here or by an independent author |
| `name`, `description`, `play_notes` | `zh-Hans` / `en` 文本；玩法说明可选 / Localized text; play instructions optional |
| `authors`, `maintainers`, `ccb_adapters` | 原作者、维护者、适配人；未知不编造 / Credits; never invent unknown people |
| `source`, `issues`, `download` | 源码、反馈、直接 ZIP 地址 / Source, issues, direct ZIP |
| `ccb_versions`, `lua_api` | 完整适配版本列表；Lua API 可选 / Exact versions; optional Lua API |
| `validation` | `passed`, `failed`, `not-tested`；附实际验证版本与日期 / Status, exact tested version and date |
| `dependencies`, `conflicts` | MOD ID 列表；首版不自动解决依赖 / MOD IDs; no automatic dependency resolver |
| `updated_at`, `license` | 包更新时间、许可证 / Package update date and license |

## 客户端规则 / Client rules

1. 仅支持已知 Schema 版本；失败时显示错误，缓存回退时说明缓存。不要无限显示“加载中”。
2. 不执行登记文件中的代码。下载只能是 HTTPS，ID/包版本不能包含路径分隔符。
3. 只有当前游戏完整版本在适配列表内、API 匹配，且 `passed` 的验证版本等于当前版本，才显示“当前版本已验证”。
4. CCB 维护包由部署生成；民间包由作者提供固定版本 ZIP。一个 ZIP 一个 MOD，根目录或一层包装目录。
5. 安装和启用不同：启动器安装到 MOD 目录，玩家在游戏世界的 MOD 列表里启用。
6. MOD 属于受信任的本地代码。收录与验证不是安全担保；替换保留旧备份，不直接删除工作版本。

Reject unsupported schemas and report fetch failures. Cache fallback must be visible.
Do not execute manifests. Require HTTPS and path-safe identifiers. Only label a MOD verified for the current game when the exact version, optional Lua API and validation evidence all match.
Install one MOD per ZIP; enabling it in a game world is a separate player action. Treat all MODs as trusted local code and preserve old packages during replacement.

## 更新链路 / Publication

申请 Issue 或登记 PR → 人工审核 → 合并 CCB-MOD → 人工运行主站 Deploy to GitHub Pages → 网站与启动器刷新。

Issue or PR → manual review → merge CCB-MOD → manually run the organization site's Deploy to GitHub Pages → refresh website/launcher.

运行入口 / Deployment workflow: [Deploy to GitHub Pages](https://github.com/CrimsonCrossBunker/CrimsonCrossBunker.github.io/actions/workflows/deploy.yml).
目录仓库 CI 只校验和打包，不会自行覆盖组织主站；部署由唯一主站流程负责。

## CBN 参考 / CBN reference (2026-09-05)

调查了 [CBN MOD 站](https://mods.cataclysmbn.org/)、[登记说明](https://github.com/cataclysmbn/registry/blob/main/site/docs/submit.md)、[源码](https://github.com/cataclysmbn/registry)。
借鉴列表、作者信息、更新时间、登记文件生成器与人工 PR 收录流程；独立实现，没有复制其 AGPL 站点源码。
本版不照搬自动抓取作者仓库、自动升级、模组套包抽取、评分、账号或多仓库拆分。

Inspired by the list, credits, update dates, manifest generator and human-reviewed submission workflow.
Implemented independently; no AGPL website source was copied. Automatic repository scanning, auto-updates, modpack extraction, ratings, accounts and repository splitting are out of scope.
