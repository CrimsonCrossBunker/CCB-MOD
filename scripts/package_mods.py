#!/usr/bin/env python3
"""Build deterministic ZIP packages for CCB-maintained MODs."""

from __future__ import annotations

import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from build_catalog import CatalogError, ROOT, validate_manifests


def package_mod(mod_dir: Path, mod_id: str, version: str, output: Path) -> Path:
    destination = output / f"{mod_id}-{version}.zip"
    files = sorted(
        path for path in mod_dir.rglob("*")
        if path.is_file() and path.name != "ccb-mod.yml" and "__pycache__" not in path.parts
    )
    if not files:
        raise CatalogError(f"{mod_dir}: MOD package is empty")
    output.mkdir(parents=True, exist_ok=True)
    with ZipFile(destination, "w", ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            relative = Path(mod_id) / path.relative_to(mod_dir)
            info = ZipInfo(relative.as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes())
    return destination


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    packages = []
    try:
        for path, entry in validate_manifests():
            if entry["type"] == "ccb-maintained":
                packages.append(package_mod(path.parent, entry["id"], entry["version"], args.output))
    except CatalogError as error:
        parser.exit(1, f"error: {error}\n")
    print(f"packaged {len(packages)} CCB-maintained MODs into {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
