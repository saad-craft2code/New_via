#!/usr/bin/env python3
"""
Empty remaining mock data arrays from mock-db.ts that represent dummy content:
- mockHotels, mockRooms, mockBundles (sample properties to manage)
- mockStaff, mockCameras, mockGuestProfiles (sample operational data)
- mockCarCompanies, mockCars (sample rental cars)

KEEP:
- mockUsers (needed for demo logins — hotel@via.example etc.)
"""

import re

PATH = "/home/z/my-project/src/lib/mock-db.ts"
with open(PATH, "r") as f:
    src = f.read()

TO_EMPTY = {
    "mockHotels",
    "mockRooms",
    "mockBundles",
    "mockStaff",
    "mockCameras",
    "mockGuestProfiles",
    "mockCarCompanies",
    "mockCars",
}

result_lines = []
i = 0
lines = src.split("\n")
while i < len(lines):
    line = lines[i]
    # Match start of an array export: `export const NAME...= [`
    m = re.match(r'^(export const (\w+)(?:[^=]*)=)\s*\[\s*$', line)
    if m and m.group(2) in TO_EMPTY:
        prefix = m.group(1)
        # Skip forward until we find the matching `];`
        depth = 1
        j = i + 1
        while j < len(lines) and depth > 0:
            test = lines[j].strip()
            if test.endswith("["):
                depth += 1
            if test == "]" or test == "];" or test.endswith("];"):
                depth -= 1
            j += 1
        result_lines.append(f"{prefix} [];")
        i = j
        continue
    result_lines.append(line)
    i += 1

with open(PATH, "w") as f:
    f.write("\n".join(result_lines))

print(f"Done. mock-db.ts now has {len(result_lines)} lines")
