# Register a community MOD

## Apply without a PR

Use the [submission form](https://crimsoncrossbunker.github.io/CCB-MOD/submit.html?lang=en).
Generate an entry, open the GitHub application draft, add test evidence, sign in and submit it yourself.
Alternatively use the repository's MOD submission issue template. Applications are public; never include tokens or private information.
Track progress in the issue. A submission is not automatic approval and does not transfer maintenance to CCB.
If you want CCB to take over the source, request that explicitly; maintainers must confirm licensing and ownership first.

## Submit a PR directly

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

## Maintainer workflow

1. Confirm author/maintainer authorization, source access and licensing. Do not infer credits from commit counts.
2. Check a fixed-version HTTPS ZIP with one MOD at the root or inside one directory.
3. Save the generated JSON (valid YAML) under `registry/community/<id>.yml`; help with missing translations and play instructions.
4. Test loading and new-world behavior in an isolated user directory. Leave `not-tested` if untested; `passed` needs exact game version, date and real evidence.
5. Generate and validate the catalog, merge through a PR, run the main site's deployment, verify the public entry and ZIP, then reply in the application issue.
6. Updates use an issue or PR with a new package version and URL. Delist abandoned/broken entries manually and redeploy; do not remotely delete players' installed MODs.

See the [catalog API](api.md). No database, review bot or admin dashboard is needed.
