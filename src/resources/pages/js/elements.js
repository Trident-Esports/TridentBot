// Index Elements
function index_elements(selector,payload) {
  let list = payload;
  for(let console of list.split("\n")) {
    if(console.trim() != "") {
      console = console.trim();
      $(selector).append($("<li>")
        .append($("<a>")
          .attr({
            "class": console,
            "href": path_join([data["project"]["url"],console])
          })
          .text(console.toUpperCase())
        )
      );
    }
  }
}

// Help Elements
function help_elements(selector, payload) {
  let preamble = "preamble" in payload ? payload["preamble"].join("<br />\n") : "";
  preamble = preamble.replaceAll("%%prefix%%", "vln ");
  preamble = preamble.replace(/`([^`]+)`/g, '<code>$1</code>');
  $("body").append($("<h1>").html(preamble));

  for(let k in payload) {
    if(!["preamble"].includes(k)) {
      console.log("Key: " + k);
      let commands = payload[k];
      console.log(commands);
      let section = commands["section"];
      let sectionHelp = commands["help"];
      $("body").append($("<h2>").text(section));
      $("body").append($("<h3>").text(sectionHelp));
      for (let command in commands["commands"]) {
        let cdata = commands["commands"][command];
        $("body").append($("<h2>").html(command));
        if(cdata["syntax"]) {
          $("body").append(
            $("<h3>").html(
              "<code>" + cdata["syntax"].replaceAll("<", "&lt;").replaceAll("%%", command) + "</code>"
            )
          );
        }
        let help = cdata["help"].join("<br />\n");
        $("body").append($("<h4>").html(help));
      }
    }
  }

}

// Roster Elements
function roster_elements(selector, payload, socials) {
  let title = payload["title"];
  $("body").append($("<h1>").text(title));

  for(let memberType in payload["members"]) {
    let memberSection = payload["members"][memberType];
    if(memberSection["users"].length) {
      $("body").append($("<h2>").text(memberSection["title"]));
      memberSection["users"].sort();
      for(let memberKey of memberSection["users"]) {
        let member = memberKey.substring(0,1).toUpperCase() + memberKey.slice(1);
        if(memberKey in socials) {
          let memberName = member;
          if("stylized" in socials[memberKey]) {
            memberName = socials[memberKey]["stylized"];
          }
          let url = "";
          let iconStyle = {"style": "width:16px;vertical-align:bottom;"}
          let icon = $("<span>").attr(iconStyle);
          if("twitch" in socials[memberKey]) {
            url = "http://twitch.tv/" + socials[memberKey]["twitch"];
            icon = $("<img>").attr("src", "http://twitch.tv/favicon.ico");
            icon.attr(iconStyle);
          } else if ("twitter" in socials[memberKey]) {
            url = "http://twitter.com/" + socials[memberKey]["twitter"];
            icon = $("<img>").attr("src", "https://twitter.com/favicon.ico");
            icon.attr(iconStyle);
          }
          if(url != "") {
            member = $("<a>").attr("href",url).text(memberName);
          } else {
            member = $("<span>").text(memberName);
          }
          member.prepend(icon);
        }
        $("body").append($("<h3>").html(member));
      }
    }
  }
}
