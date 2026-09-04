# 登记民间 MOD
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
