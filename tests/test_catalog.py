import json
import sys
import tempfile
import unittest
from pathlib import Path
from zipfile import ZipFile
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from build_catalog import CatalogError, build_catalog, render_catalog  # noqa: E402
import shutil
import yaml
from package_mods import package_mod  # noqa: E402


class CatalogTests(unittest.TestCase):
    def test_catalog_contains_maintained_example(self):
        catalog = build_catalog()
        self.assertEqual(catalog["schema_version"], 1)
        self.assertEqual({entry["id"] for entry in catalog["mods"]}, {"hello_ccb", "field_journal", "pocket_alarm", "scrap_multitool"})
        self.assertEqual(catalog["mods"][0]["lua_api"], 1)

    def test_catalog_is_json_and_bilingual(self):
        catalog = json.loads(render_catalog(build_catalog()))
        self.assertIn("zh-Hans", catalog["mods"][0]["name"])
        self.assertIn("en", catalog["mods"][0]["name"])

    def test_package_has_platform_entrypoints(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = package_mod(ROOT / "mods" / "hello_ccb", "hello_ccb", "0.1.0", Path(directory))
            with ZipFile(destination) as archive:
                self.assertIn("hello_ccb/main.lua", archive.namelist())
                self.assertIn("hello_ccb/mod.lua", archive.namelist())
                self.assertNotIn("hello_ccb/ccb-mod.yml", archive.namelist())

    def test_community_entry_uses_author_url(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            shutil.copytree(ROOT / "schemas", root / "schemas")
            (root / "registry/community").mkdir(parents=True)
            entry = dict(build_catalog()["mods"][0])
            entry.update(id="fixture_author_mod", type="community", download="https://example.invalid/v1.zip")
            path = root / "registry/community/fixture_author_mod.yml"
            path.write_text(yaml.safe_dump(entry), encoding="utf-8")
            self.assertEqual(build_catalog(root)["mods"][0]["download"], entry["download"])
            entry["version"] = "../../unsafe"
            path.write_text(yaml.safe_dump(entry), encoding="utf-8")
            with self.assertRaises(CatalogError):
                build_catalog(root)

    def test_all_packages_include_license_and_entrypoints(self):
        with tempfile.TemporaryDirectory() as directory:
            for entry in build_catalog()["mods"]:
                if entry["type"] != "ccb-maintained":
                    continue
                path = package_mod(ROOT / "mods" / entry["id"], entry["id"], entry["version"], Path(directory))
                first = path.read_bytes()
                package_mod(ROOT / "mods" / entry["id"], entry["id"], entry["version"], Path(directory))
                self.assertEqual(first, path.read_bytes())
                with ZipFile(path) as archive:
                    for name in ["main.lua", "mod.lua", "LICENSE", "README.en.md", "README.zh-Hans.md"]:
                        self.assertIn(entry["id"] + "/" + name, archive.namelist())


if __name__ == "__main__":
    unittest.main()
