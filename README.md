# CCB-MOD
CCB-MOD is the public catalog for external Cataclysm: Cleanwater Bomb Mods.
It contains two kinds of entries:

- `ccb-maintained`: source is stored under `mods/` and maintained by CCB;
- `community`: source remains in the author's repository and only its catalog entry is stored here.

The generated [`mods.json`](generated/mods.json) is the single data source for
the MOD website and Catapult. There is no account system or database in v1.
Validation catches basic format errors; maintainers handle exceptions in pull requests.

CCB-MOD 是《大灾变：清水炸弹》的外部 MOD 目录。第一版只分两类：

- `ccb-maintained`：源码放在 `mods/`，由 CCB 或指定维护者维护；
- `community`：源码保留在作者仓库，这里只登记信息和下载地址。

MOD 站和 Catapult 共用 [`generated/mods.json`](generated/mods.json)。第一版不做账号、
评分或数据库；自动检查只处理基本格式，其余问题由维护者在 PR 中人工处理。

## Local checks / 本地检查

```sh
python3 -m pip install -r requirements.txt
python3 scripts/build_catalog.py --check
python3 -m unittest discover -s tests -p 'test_*.py'
python3 scripts/package_mods.py --output /tmp/ccb-mod-packages
```

Registration instructions:

- [简体中文](docs/register.zh-Hans.md)
- [English](docs/register.en.md)
