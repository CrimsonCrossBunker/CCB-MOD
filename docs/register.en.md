# Register a community MOD

1. Develop and release the MOD in your own repository. The download URL must point directly to a ZIP.
2. Copy `registry/community/example.yml` to `registry/community/<mod-id>.yml`.
3. Fill in the authors, maintainers, version, license, supported CCB versions, and download URL.
4. Run `python3 scripts/build_catalog.py`.
5. Open a pull request. A Registry maintainer reviews it manually after the automated checks pass.
6. A maintainer runs **Deploy to GitHub Pages** in the organization website's Actions. The website and launcher receive the update after deployment succeeds.

The first-version baseline is `0.Ag-Candidate-2026-09-05-0219`, Lua API `1`. Record the exact tag you tested.
CI checks the catalog format, generated files, and packaging. Authors or maintainers perform game validation.
Create `config/` inside an isolated user directory before running `--check-mods <id>`, then test in a new world.

The author remains responsible for a community MOD. Use `not-tested` when compatibility is unknown
and `failed` when a check fails; registration never requires pretending that a MOD was verified.
