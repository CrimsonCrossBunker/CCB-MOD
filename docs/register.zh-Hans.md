# 登记民间 MOD

## 不会提交 PR？直接申请

打开 [申请收录](https://crimsoncrossbunker.github.io/CCB-MOD/submit.html?lang=zh-Hans)，填写信息，
生成登记文件，然后打开 GitHub 申请草稿。登录 GitHub，补充测试记录并自己点击提交。
也可直接使用仓库的“MOD 收录申请”Issue 模板。申请信息公开；不要填写令牌或个人隐私。
审核进度在该 Issue 跟进。申请本身不会立即上架，民间 MOD 也不会因此变成 CCB 维护。
如果希望 CCB 接管源码，请在 Issue 中另外说明；维护者确认许可和接管人后才转为 `ccb-maintained`。

## 熟悉 Git：直接提交登记 PR

1. 在你自己的仓库开发并发布 MOD；下载地址必须直接指向 ZIP。
2. 复制 `registry/community/example.yml` 为 `registry/community/<mod-id>.yml`。
3. 填写作者、维护者、版本、许可证、CCB 版本和下载地址。
4. 运行 `python3 scripts/build_catalog.py`。
5. 提交 PR。自动检查通过后，由 Registry 维护者人工确认并合并。
6. 维护者到组织主站的 Actions 运行“Deploy to GitHub Pages”。部署成功后，网站和启动器才能读到更新。

首版基线为 `0.Ag-Candidate-2026-09-05-0219`，Lua API 为 `1`。作者填写实际测试的完整版本号。
CI 检查注册格式、目录一致性和打包；游戏下载及运行验证由作者或维护者执行。
命令行验证前需创建用户目录下的 `config/`，再运行 `--check-mods <id>`；随后在新世界测试。

民间 MOD 仍由作者维护。无法确认兼容性时使用 `not-tested`；失败时使用 `failed`，
不需要为了登记而假装已经验证。

## 维护者：收到申请以后

1. 确认提交人是作者或获授权维护者、源码和许可可访问；作者字段不凭 Git 提交数量猜测。
2. 检查 ZIP 是固定版本链接，只含一个 MOD，入口位于根目录或一层包装目录。
3. 将生成的 JSON（也是有效 YAML）保存为 `registry/community/<id>.yml`，必要时协助补齐双语信息和怎么玩。
4. 在隔离目录验证加载、新世界玩法；没有做过就保持 `not-tested`。`passed` 必须附完整游戏版本、日期和实际测试记录。
5. 生成目录、运行校验、通过 PR 合并。随后运行主站部署并确认公网条目及 ZIP 可访问，再回到申请 Issue 告知结果。
6. 后续更新仍用 Issue 或 PR，使用新包版本和新 ZIP。无法维护时人工删除登记并重新部署；不会远程删除玩家已安装的 MOD。

入口、字段和客户端规则见 [目录 API](api.md)。不用数据库、机器人审核或后台管理面板。
