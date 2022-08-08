let data
let prefix = "vln "

// Index Elements
function index_elements(payload) {
  for(let [section, sectionData] of Object.entries(payload)) {
    let sectionEle = $("#section")[0]["content"].cloneNode(true)
    $(sectionEle).find("h2")
      .text(section.charAt(0).toUpperCase() + section.slice(1))
    for(let [linkPath, linkText] of Object.entries(sectionData)) {
      let linkEle = $("#link")[0]["content"].cloneNode(true)
      let linkURL = linkPath
      if(linkURL.includes("dbs/")) {
        if(linkURL.includes("game/")) {
          linkURL = linkURL.replace("game/","")
          linkURL = linkURL.replace("help.html","gamehelp.html")
        }
        linkURL = linkURL.replace("dbs/","pages/help/")
      } else if(linkURL.includes("tdnt/")) {
        linkURL = linkURL.replace("tdnt/","pages/rosters/tdnt/")
      }
      $(linkEle).find("a").attr("href",linkURL)
      $(linkEle).find("a").text(linkText)
      $(sectionEle).find("ul")
        .append(linkEle)
    }
    $("#fileindex").append(sectionEle)
  }
}

// Help Elements
function help_elements(payload) {
  let preamble = payload?.preamble
  let commandSections = []

  if(preamble) {
    let tmp = $("#preamble")[0]["content"].cloneNode(true)
    $(tmp).find("b")
      .html(
        preamble.join("<br />")
          .replaceAll("%%prefix%%",prefix)
          .replace(/(?:[`])([^`]*)(?:[`])/g, "<code>$1</code>")
      )
    $("body").append(tmp)
  }

  if(payload?.commands) {
    commandSections = [payload.commands]
  } else {
    commandSections = payload
  }

  if(commandSections) {
    for(let commandSection in commandSections) {
      let commands = commandSections[commandSection]
      for(let [k, v] of Object.entries(commands)) {
        if(k == "section") {
          let tmp = $("#section")[0]["content"].cloneNode(true)
          $(tmp).find("div").addClass(commandSection)
          $(tmp).find("h2")
            .text(v);
          $("body").append(tmp)
        } else if(k == "help") {
          $("body").find("." + commandSection + " i")
            .text(v)
        } else if(k == "commands") {
          for(let [command, commandData] of Object.entries(v)) {
            let tmp = $("#command")[0]["content"].cloneNode(true)
            let text = `\`${command}\``
            if(commandData["aliases"]) {
              text += ` (\`${commandData["aliases"].join("\`, \`")}\`)`
            }
            if(commandData["syntax"] && commandData["syntax"] != "") {
              text += "<br />"
              text += "`"
              text += commandData["syntax"]
                .replaceAll("%%",command)
                .replaceAll("<", "&lt;")
              text += "`"
            }
            text = text.replace(/(?:[`])([^`]*)(?:[`])/g, "<code>$1</code>")
            $(tmp).find(".commandName")
              .html(text)
            $(tmp).find(".commandDesc")
              .text(commandData["help"])
            $("body").find(`.${commandSection} dl`).append(tmp)
          }
        }
      }
    }
  }

  console.log("Payload Keys:")
  console.log(Object.keys(payload))
  console.log()
  if(preamble) {
    console.log("Preamble:")
    console.log(preamble)
  }
  if(commandSections) {
    console.log("Commands:")
    console.log(commandSections)
  }
  if(!(preamble && commandSections)) {
    console.log("Payload:")
    console.log(payload)
  }
}

function roster_elements(payload) {
  let title = payload?.title
  let members = payload?.members

  if(title) {
    let tmp = $("#title")[0]["content"].cloneNode(true)
    $("title")
      .text(title)
    $(tmp).find("h1")
      .text(title)
    $("body").append(tmp)
    if(members) {
      for(let [section, sectionData] of Object.entries(members)) {
        if(sectionData?.users && sectionData.users.length > 0) {
          let sectionEle = $("#section")[0]["content"].cloneNode(true)
          if(sectionData?.title) {
            $(sectionEle).find("h2")
              .text(sectionData.title)
          }
          for(let user of sectionData.users) {
            let userdata
            if(data?.socials[user]) {
              userdata = data.socials[user]
              // console.log(data.socials[user])
            }
            let userlink = $("<a>")
              .attr("href",
                (userdata?.twitch && `http://twitch.tv/${userdata.twitch}`) ||
                (userdata?.twitter && `http://twitter.com/${userdata.twitter}`)
              )
              .text(
                userdata?.stylized ||
                user
              )
            let tmp = $("#member")[0]["content"].cloneNode(true)
            $(tmp).find(".member")
              .append(userlink)
            $(sectionEle).find(".memberlist").append(tmp)
          }
          $("body").append(sectionEle)
        }
      }
    }
  }

  console.log("Payload Keys:")
  console.log(Object.keys(payload))
  console.log()
  if(title) {
    console.log(`Title: ${title}`)
  }
  if(members) {
    console.log("Members:")
    console.log(members)
  }
  if(!(title && members)) {
    console.log("Payload:")
    console.log(payload)
  }
}
