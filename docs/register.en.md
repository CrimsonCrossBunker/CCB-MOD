# Register a community MOD

1. Develop and release the MOD in your own repository. The download URL must point directly to a ZIP.
2. Copy `registry/community/example.yml` to `registry/community/<mod-id>.yml`.
3. Fill in the authors, maintainers, version, license, supported CCB versions, and download URL.
4. Run `python3 scripts/build_catalog.py`.
5. Open a pull request. A Registry maintainer reviews it manually after the automated checks pass.

The author remains responsible for a community MOD. Use `not-tested` when compatibility is unknown
and `failed` when a check fails; registration never requires pretending that a MOD was verified.
