# 登记民间 MOD
1. 在你自己的仓库开发并发布 MOD；下载地址必须直接指向 ZIP。
2. 复制 `registry/community/example.yml` 为 `registry/community/<mod-id>.yml`。
3. 填写作者、维护者、版本、许可证、CCB 版本和下载地址。
4. 运行 `python3 scripts/build_catalog.py`。
5. 提交 PR。自动检查通过后，由 Registry 维护者人工确认并合并。

民间 MOD 仍由作者维护。无法确认兼容性时使用 `not-tested`；失败时使用 `failed`，
不需要为了登记而假装已经验证。
