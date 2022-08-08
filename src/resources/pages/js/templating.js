// Fetch a URL
function fetch_and_return(url) {
  fetch(url)
    .then(httpstatus)
    .then(parse)
    .then(function(payload) {
      // console.log(payload);
      let type = "help"
      type = (url.includes("filelist.json")) && "index" || type
      type = (url.includes("help")) && "help" || type
      type = (url.includes("roster")) && "roster" || type
      if(type == "index") {
        index_elements(payload)
      } else if(type == "help") {
        help_elements(payload)
      } else if(type == "roster") {
        roster_elements(payload)
      }
    })
}

// Get a template, copy it, manip it
function add_template(name,attrs) {
  if(name.includes("Header")) {
    // If it's a Header
    let tmp = $("#" + name)[0]["content"].cloneNode(true);
    $(tmp).find("a")
      .attr({
        "href": attrs["href"]
      })
      .text(attrs["text"])
      $("body").append(tmp)
  } else if(name == "spritePreview") {
    // If it's a Sprite Preview
    let tmp = $("#spritePreview")[0]["content"].cloneNode(true);
    if(!("preview" in attrs)) {
      attrs["preview"] = attrs["file"]
    }
    $(tmp).find(".name a")
      .attr({
        "href": attrs["file"]
      })
      .text(attrs["name"])
    $(tmp).find(".author").text(attrs["author"])
    $(tmp).find(".sprite-preview")
      .attr({
        "style": "background-image:url(" + attrs["preview"] + ")"
      })
    $("#sprite-previewlist").append(tmp)
  } else if(name == "resource") {
    // If it's a Resource link
    let tmp = $("#resourceList")[0]["content"].cloneNode(true)
    $(tmp).find(".app").text(attrs["app"])
    for(let link of ["file","site","repo"]) {
      if(link in attrs) {
        $(tmp).find('.' + link + " a")
          .attr({
            "href": attrs[link]
          })
          if(link == "file" && attrs["app"] == "Various") {
            $(tmp).find('.' + link + " a").text(attrs["file"].substr(attrs["file"].lastIndexOf('.') + 1).toUpperCase())
          }
      } else {
        $(tmp).find('.' + link)
          .attr({
            "style": "display:none"
          })
      }
    }
    $("#sprite-resources").append(tmp)
    if(data["game"]["slug"] == "zelda3" && data["sprite"]["slug"] == "link" && attrs["app"].includes("GIMP")) {
      // If we're adding Z3R's stuff
      fetch(path_join([data["sprite"]["url"],"linklist.json"]))
        .then(httpstatus)
        .then(parse)
        .then(function(payload) {
          let linklist = payload;
          add_linklist({
            "name": "A Link to the Past Randomizer 'Official' Sprites",
            "links": linklist
          })
        })
    }
  }
}

// Add a Link list to #resources
function add_linklist(attrs) {
  let list_li = $("<li>").text(attrs["name"])
  let ul = $("<ul>")

  for(let link of attrs["links"]) {
    let li = $("<li>")
    let a = $("<a>").attr({"href":link["url"]}).text(link["name"])
    li.append(a)
    ul.append(li)
  }

  list_li.append(ul)
  $("#sprite-resources").append(list_li)
}
