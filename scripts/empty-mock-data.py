#!/usr/bin/env python3
"""
Empty all dummy data arrays from mock-data.ts while preserving:
- All TypeScript interfaces and types
- All array declarations (just empty them: `[]`)
- All function/const declarations
- Provider profile structure (replaced with empty placeholder)
"""
import re

PATH = "/home/z/my-project/src/lib/mock-data.ts"
with open(PATH, "r") as f:
    src = f.read()

# Pattern: export const X: Type[] = [ ... ];
# We want to keep the type but replace array contents with []
# Match: export const NAME: TYPENAME[] = [ <anything until matching close> ];
# Easier: find every `export const X: ... = [` and replace the array literal with `[]`

# Approach: walk the file, find each `export const NAME...= [` and balance braces
# until the closing `];`. Replace contents with `[]`.

result_lines = []
i = 0
lines = src.split("\n")
while i < len(lines):
    line = lines[i]
    # Match start of an array export
    m = re.match(r'^(export const \w+[^=]*=)\s*\[\s*$', line)
    if m:
        prefix = m.group(1)
        # Skip forward until we find the matching `];`
        depth = 1
        j = i + 1
        while j < len(lines) and depth > 0:
            test = lines[j].strip()
            if test.endswith("["):
                depth += 1
            if test == "]" or test.endswith("]") or test == "];":
                depth -= 1
            j += 1
        # Replace with `[];`
        result_lines.append(f"{prefix} [];")
        i = j
        continue

    # Match inline: `export const X = [ ... ];` (single line) — leave as-is if empty
    m2 = re.match(r'^(export const \w+[^=]*=)\s*\[(.*)\];\s*$', line)
    if m2 and m2.group(2).strip() != "":
        result_lines.append(f"{m2.group(1)} [];")
        i += 1
        continue

    result_lines.append(line)
    i += 1

with open(PATH, "w") as f:
    f.write("\n".join(result_lines))

print(f"Done. File now has {len(result_lines)} lines")
