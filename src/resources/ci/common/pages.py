import json
import os

from shutil import copy, copytree, rmtree, move

# File listings
fileList = {
  "help": {},
  "roster": {}
}

# Help DB Files
helpFiles = [
  "dbs/eseahelp.json",
  "dbs/eventhelp.json",
  "game/dbs/help.json",
  "dbs/help.json",
  "dbs/mod.json"
]

# Help Template File
# print("Get Help Template")
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
# print("Get Roster Template")
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

# Nuke HTML dir for clean workspace
if(os.path.exists(os.path.join(".","html"))):
  rmtree(os.path.join(".","html"))

# Copy to HTML dirs
for [srcPath, destPath] in [
  [
    os.path.join(".","src","resources","pages"),
    os.path.join(".","html","pages")
  ]
]:
  print(f"Copying: {srcPath} to: {destPath}")
  copytree(
    srcPath,
    destPath
  )

# Move Index File
move(
  os.path.join(".","html","pages","index.html"),
  os.path.join(".","html","index.html")
)

# Make HTML subdirs
# print("Make HTML subdirs")
for makeDir in [
  os.path.join(".","src","resources","pages","help"),
  os.path.join(".","src","resources","pages","rosters"),
  os.path.join(".","html","dbs"),
  os.path.join(".","html","game","dbs")
]:
  if(not os.path.exists(makeDir)):
    # print(f"Making: {makeDir}")
    os.makedirs(makeDir)

# Cycle through Help DBs
for helpFileName in helpFiles:
  helpFilePath = os.path.join(
    ".",
    "src",
    helpFileName
  )

  # Note Help DB filepath
  fileKey = helpFileName.replace(".json",".html")
  fileVal = ("game" not in helpFileName and os.path.splitext(helpFileName)[0][helpFileName.rfind("/") + 1:] or "gamehelp").replace("esea","ESEA")
  fileVal = f"{fileVal[:1].upper()}{fileVal[1:]}"
  if len(fileVal) > len("help") and "help" in fileVal.lower():
    fileVal = fileVal.replace("help"," Help")

  fileList["help"][fileKey] = fileVal

  # Write page to view Help file
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

# Cycle through Roster DBs
for r,d,f in os.walk(os.path.join(".","src","rosters")):
  # print(r,d,f)
  for rosterFileName in f:
    if "tdnt" in r:
      rosterFilePath = os.path.join(
        r,
        rosterFileName
      )

      # Write page to view Roster file
      with open(rosterFilePath) as rosterFile:
        destDir = r.replace(f"rosters{os.path.sep}dbs",f"pages{os.path.sep}rosters")
        destDir = destDir.replace("src","html")
        if(not os.path.exists(destDir)):
          os.makedirs(destDir)
        destFile = os.path.join(
          destDir,
          os.path.basename(rosterFilePath).replace(".json",".html")
        )

        # Note Roster filepath
        fileKey = destFile
        fileKey = fileKey[fileKey.find(f"rosters{os.path.sep}")+len(f"rosters{os.path.sep}"):].replace(os.path.sep,"/")
        fileVal = os.path.splitext(rosterFileName)[0][rosterFileName.rfind("/") + 1:]
        if "staff" in fileKey:
          if len(fileVal) <=2 :
            fileVal = fileVal.upper()
          elif fileVal.lower() == "socialmedia":
            fileVal = "Social Media"
          else:
            fileVal = f"{fileVal[:1].upper()}{fileVal[1:]}"
          fileVal = f"Staff: {fileVal}"
        if "teams" in fileKey:
          game = fileKey[fileKey.find("teams/")+len("teams/"):fileKey.rfind("/")]
          games = {
            "csgo": "CS:GO",
            "pubg": "PUBG",
            "r6s": "Rainbow Six Siege",
            "rocketleague": "Rocket League",
            "val": "VALORANT"
          }
          if game in games:
            game = games[game]
          fileVal = f"{game}: {fileVal[:1].upper()}{fileVal[1:]}"
        fileList["roster"][fileKey] = fileVal

        with open(destFile, "w") as thisOutput:
          rosterPath = "dbs" + destDir[20:].replace("\\","/") + "/" + rosterFileName
          rosterRepeat = rosterPath.count("/") + 1
          thisTemplate = rosterTemplate.replace("../../../", ("../" * (rosterRepeat - 1)))
          thisTemplate = thisTemplate.replace("<PATH_ROSTER>", rosterPath)
          thisTemplate = thisTemplate.replace("<REPEAT_ROSTER>", str(rosterRepeat))
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

# Copy Roster DBs
copytree(
  os.path.join(
    ".",
    "src",
    "rosters"
  ),
  os.path.join(
    ".",
    "html",
    "rosters"
  )
)

# Write File List
print("Writing File List")
with open(os.path.join(".","html","pages","filelist.json"), "w") as fileListFile:
  json.dump(fileList, fileListFile, indent=2)
# print(fileList)
