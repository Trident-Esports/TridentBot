"""Generate dbs manifest"""
import json
import os

files = []
root = [".","src","rosters","dbs"]
rdir = ["tdnt"]
for r,d,f in os.walk(
  os.path.join(
    *root,
    *rdir
  )
):
    for fname in f:
        if fname not in ["guilds.json","manifest.json"]:
            files.append(os.path.join(r,fname).replace(os.path.join(*root, ""), ""))

files.sort()
json_obj = json.dumps(files, indent=2)

with open(os.path.join(".","src","rosters","dbs","manifest.json"), "w", encoding="utf-8") as manifest:
    manifest.write(json_obj)

print(json_obj)
