function indexPage(path="") {
  data = {
    "path": path
  }

  fetch_and_return(path)
}

function helpPage(path="") {
  data = {
    "path": path
  }

  fetch_and_return(path)
}

function rosterPage(path="") {
  data = {
    "path": path
  }

  let upFolders = (path.match(/\.\.\//g)?.length)
  if(upFolders) {
    fetch("../".repeat(upFolders) + "rosters/dbs/socials/users.json")
    .then(httpstatus)
    .then(parse)
    .then(function(payload) {
      data["socials"] = payload
      fetch_and_return(path)
    })
  }
}
