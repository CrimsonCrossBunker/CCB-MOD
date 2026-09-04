#!/usr/bin/env python3
"""Validate CCB-MOD manifests and build the public v1 catalog."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import yaml
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
PACKAGE_BASE_URL = "https://crimsoncrossbunker.github.io/CCB-MOD/packages"


class CatalogError(RuntimeError):
    """A human-readable catalog validation error."""


def manifest_paths(root: Path = ROOT) -> list[Path]:
    return sorted((root / "mods").glob("*/ccb-mod.yml")) + sorted(
        path
        for path in (root / "registry" / "community").glob("*.yml")
        if path.name != "example.yml"
    )


def load_manifest(path: Path) -> dict[str, Any]:
    try:
        value = yaml.safe_load(path.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as error:
        raise CatalogError(f"{path}: cannot read YAML: {error}") from error
    if not isinstance(value, dict):
        raise CatalogError(f"{path}: manifest must be a mapping")
    return value


def validate_manifests(root: Path = ROOT) -> list[tuple[Path, dict[str, Any]]]:
    schema = json.loads((root / "schemas" / "mod-v1.schema.json").read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    loaded: list[tuple[Path, dict[str, Any]]] = []
    seen: dict[str, Path] = {}

    for path in manifest_paths(root):
        entry = load_manifest(path)
        errors = sorted(validator.iter_errors(entry), key=lambda item: list(item.path))
        if errors:
            details = "; ".join(
                f"{'.'.join(map(str, error.path)) or '<root>'}: {error.message}"
                for error in errors
            )
            raise CatalogError(f"{path}: {details}")

        mod_id = entry["id"]
        if mod_id in seen:
            raise CatalogError(f"duplicate id {mod_id!r}: {seen[mod_id]} and {path}")
        seen[mod_id] = path

        is_maintained_path = path.parent.parent.name == "mods"
        if is_maintained_path != (entry["type"] == "ccb-maintained"):
            expected = "mods/<id>/ccb-mod.yml" if entry["type"] == "ccb-maintained" else "registry/community/<id>.yml"
            raise CatalogError(f"{path}: {entry['type']} entry must be stored at {expected}")

        if entry["type"] == "ccb-maintained":
            mod_dir = path.parent
            if mod_dir.name != mod_id:
                raise CatalogError(f"{path}: directory name must match id {mod_id!r}")
            if not (mod_dir / "main.lua").is_file() and not (mod_dir / "modinfo.json").is_file():
                raise CatalogError(f"{path}: maintained MOD requires root main.lua or modinfo.json")
            for field in ("name", "description"):
                missing = {"zh-Hans", "en"} - set(entry[field])
                if missing:
                    raise CatalogError(f"{path}: {field} is missing {', '.join(sorted(missing))}")
        loaded.append((path, entry))

    return loaded


def public_entry(entry: dict[str, Any]) -> dict[str, Any]:
    result = dict(entry)
    if result["type"] == "ccb-maintained":
        result["download"] = f'{PACKAGE_BASE_URL}/{result["id"]}-{result["version"]}.zip'
    return result


def build_catalog(root: Path = ROOT) -> dict[str, Any]:
    entries = [public_entry(entry) for _, entry in validate_manifests(root)]
    entries.sort(key=lambda entry: (entry["type"], entry["id"].casefold()))
    updated_at = max((entry["updated_at"] for entry in entries), default="1970-01-01")
    return {
        "schema_version": 1,
        "generated_at": f"{updated_at}T00:00:00Z",
        "mods": entries,
    }


def render_catalog(catalog: dict[str, Any]) -> str:
    return json.dumps(catalog, ensure_ascii=False, indent=2, sort_keys=False) + "\n"


def write_or_check(rendered: str, check: bool, root: Path = ROOT) -> None:
    targets = (root / "generated" / "mods.json", root / "site" / "mods.json")
    stale: list[Path] = []
    for path in targets:
        if check:
            if not path.is_file() or path.read_text(encoding="utf-8") != rendered:
                stale.append(path)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(rendered, encoding="utf-8")
    if stale:
        names = ", ".join(str(path.relative_to(root)) for path in stale)
        raise CatalogError(f"generated catalog is stale: {names}; run scripts/build_catalog.py")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify generated files without writing")
    args = parser.parse_args()
    try:
        catalog = build_catalog()
        write_or_check(render_catalog(catalog), args.check)
    except CatalogError as error:
        parser.exit(1, f"error: {error}\n")
    action = "checked" if args.check else "generated"
    print(f"{action} {len(catalog['mods'])} MOD entries")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
