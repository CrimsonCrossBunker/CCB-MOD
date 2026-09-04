import json
import sys
import tempfile
import unittest
from pathlib import Path
from zipfile import ZipFile
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from build_catalog import build_catalog, render_catalog  # noqa: E402
from package_mods import package_mod  # noqa: E402


class CatalogTests(unittest.TestCase):
    def test_catalog_contains_maintained_example(self):
        catalog = build_catalog()
        self.assertEqual(catalog["schema_version"], 1)
        self.assertEqual([entry["id"] for entry in catalog["mods"]], ["hello_ccb"])
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


if __name__ == "__main__":
    unittest.main()
