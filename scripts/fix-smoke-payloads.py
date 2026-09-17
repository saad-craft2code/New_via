#!/usr/bin/env python3
"""Clean up the smoke test JSON payloads (strip phone/companyName from login)."""
from pathlib import Path

p = Path("/home/z/my-project/scripts/smoke-test.sh")
src = p.read_text()

# Replace the two login payloads to only contain email/password/role
old1 = '''{
  "email":"owner@smoke.test","password":"password123",
  "role":"hotel_owner","phone":"+971500000000","companyName":"Smoke Hotels LLC"
}'''
new1 = '''{
  "email":"owner@smoke.test","password":"password123","role":"hotel_owner"
}'''

old2 = '''{
  "email":"creator@smoke.test","password":"password123",
  "role":"bundle_creator","phone":"+971500000001","companyName":"Smoke Tours LLC"
}'''
new2 = '''{
  "email":"creator@smoke.test","password":"password123","role":"bundle_creator"
}'''

src = src.replace(old1, new1).replace(old2, new2)
p.write_text(src)
print("[ok] cleaned up login payloads")
