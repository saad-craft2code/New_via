#!/usr/bin/env python3
"""
Empty specific dummy data arrays from mock-db.ts:
- mockBookings (dummy hotel/bundle bookings)
- mockSalaries (dummy salary payments)
- mockCarBookings (dummy car rental bookings)
- mockStaffTasks (dummy tasks)
- mockCheckIns (dummy check-ins)
- mockInventory (dummy inventory items)
- mockMaintenance (dummy maintenance requests)
- mockReviews (dummy reviews)
- mockNotifications (dummy notifications)
- mockTransactions (if exists)
Keep:
- mockUsers (demo logins — needed for the panel to actually work)
- mockHotels (sample hotels so hotel owner has data to manage)
- mockRooms (rooms for those hotels)
- mockBundles (sample bundles for bundle creator)
- mockStaff (sample staff to manage)
- mockCameras (sample cameras)
- mockGuestProfiles (sample guest profiles)
- mockCarCompanies (sample rental companies)
- mockCars (sample rental cars)
"""
import re

PATH = "/home/z/my-project/src/lib/mock-db.ts"
with open(PATH, "r") as f:
    src = f.read()

TO_EMPTY = {
    "mockBookings",
    "mockSalaries",
    "mockCarBookings",
    "mockStaffTasks",
    "mockCheckIns",
    "mockInventory",
    "mockMaintenance",
    "mockReviews",
    "mockNotifications",
}

result_lines = []
i = 0
lines = src.split("\n")
while i < len(lines):
    line = lines[i]
    # Match start of an array export: `export const NAME: Type[] = [`
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
