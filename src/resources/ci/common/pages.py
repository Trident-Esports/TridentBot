import json
import os

from shutil import copy, copytree, rmtree

# Help DB Files
helpFiles = [
  "dbs/eseahelp.json",
  "dbs/eventhelp.json",
  "game/dbs/help.json",
  "dbs/help.json",
  "dbs/mod.json"
]

# Help Template File
print("Get Help Template")
helpTemplateFile = open(
  os.path.join(
    ".",
    "src",
    "resources",
    "ci",
    "templates",
    "help.html"
  )
)
helpTemplate = helpTemplateFile.read()
helpTemplateFile.close()

# Roster Template File
print("Get Roster Template")
rosterTemplateFile = open(
  os.path.join(
    ".",
    "src",
    "resources",
    "ci",
    "templates",
    "roster.html"
  )
)
rosterTemplate = rosterTemplateFile.read()
rosterTemplateFile.close()

# Nuke HTML dir
if(os.path.exists(os.path.join(".","html"))):
  rmtree(os.path.join(".","html"))

# Make HTML dirs
print("Make HTML dirs")
for makeDir in [
  os.path.join(".","src","pages","help"),
  os.path.join(".","src","pages","rosters"),
  os.path.join(".","html","dbs"),
  os.path.join(".","html","game","dbs")
]:
  if(not os.path.exists(makeDir)):
    print(f"Making: {makeDir}")
    os.makedirs(makeDir)

# Cycle through Help DBs
for helpFileName in helpFiles:
  helpFilePath = os.path.join(
    ".",
    "src",
    helpFileName
  )
  # Write page to view help file
  with open(helpFilePath) as helpFile:
    destDir = os.path.join(".","html","pages","help")
    destFile = os.path.join(
      destDir,
      os.path.basename(helpFilePath).replace(".json",".html")
    )
    if(not os.path.exists(destDir)):
      os.makedirs(destDir)
    with open(destFile, "w") as thisOutput:
      thisTemplate = helpTemplate.replace("<PATH_HELP>", helpFileName)
      print(f"Writing Help: {destFile}")
      thisOutput.write(thisTemplate)

for r,d,f in os.walk(os.path.join(".","src","rosters")):
  # print(r,d,f)
  for rosterFileName in f:
    if "tdnt" in r:
      rosterFilePath = os.path.join(
        r,
        rosterFileName
      )
      with open(rosterFilePath) as rosterFile:
        destDir = r.replace(f"rosters{os.path.sep}dbs",f"pages{os.path.sep}rosters")
        destDir = destDir.replace("src","html")
        if(not os.path.exists(destDir)):
          os.makedirs(destDir)
        destFile = os.path.join(
          destDir,
          os.path.basename(rosterFilePath).replace(".json",".html")
        )
        with open(destFile, "w") as thisOutput:
          thisTemplate = rosterTemplate.replace("<PATH_ROSTER>", destDir[20:].replace("\\","/") + "/" + rosterFileName)
          print(f"Writing Roster: {destFile}")
          thisOutput.write(thisTemplate)

# Copy Help DBs
for helpFileName in helpFiles:
  copy(
    os.path.join(
      ".",
      "src",
      helpFileName
    ),
    os.path.join(
      ".",
      "html",
      helpFileName
    )
  )

# Copy to HTML dirs
for destPath in [
  os.path.join(
    ".",
    "html",
    "rosters"
  )
]:
  srcPath = destPath.replace("html","src")

  # Copy from SRC dirs to HTML dirs
  copytree(
    os.path.join(srcPath),
    os.path.join(destPath)
  )
