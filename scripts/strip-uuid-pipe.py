#!/usr/bin/env python3
"""Remove ParseUUIDPipe from controller @Param() decorators (Prisma uses cuid)."""
import re
from pathlib import Path

files = [
    "/home/z/my-project/apps/api/src/rooms/rooms.controller.ts",
    "/home/z/my-project/apps/api/src/hotels/hotels.controller.ts",
    "/home/z/my-project/apps/api/src/bundles/bundles.controller.ts",
]

for f in files:
    p = Path(f)
    src = p.read_text()
    # Strip ", ParseUUIDPipe" from @Param('xxx', ParseUUIDPipe)
    new = re.sub(
        r"@Param\((['\"])([a-zA-Z]+)\1\s*,\s*ParseUUIDPipe\)",
        r'@Param(\1\2\1)',
        src,
    )
    # Remove the now-unused ParseUUIDPipe import
    new = re.sub(r"^\s*ParseUUIDPipe,\s*\n", "", new, flags=re.MULTILINE)
    if new != src:
        p.write_text(new)
        print(f"[ok] patched {p.name}")
    else:
        print(f"[skip] no change in {p.name}")
