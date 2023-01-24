// Read a text file
function readTextFile(file) {
  // Create a request
  let rawFile = new XMLHttpRequest();
  let allText = "";
  rawFile.onreadystatechange = function () {
    // If we're ready to read
    if (rawFile.readyState === 4) {
      // If it's OK
      if (rawFile.status === 200 || rawFile.status == 0) {
        // Return the thing
        allText = rawFile.responseText;
        // If it's not OK
      } else if (rawFile.status === 404) {
        // Return null
        return null;
      }
    }
  }

  // Get the thing
  rawFile.open("GET", file, false);
  rawFile.send(null);

  return allText;
}

function indexPage() {
  path = "./";
  // SpriteSomething
  let title_a = $("<a>")
    .attr({
      "href": "https://artheau.github.io/SpriteSomething/"
    })
    .text("SpriteSomething");
  let title = $("<h1>")
    .append(title_a);
  $("body").append(title);

  // Custom Sprite Repositories
  let list_ul = $("<ul>");
  let list_li_a = $("<a>")
    .attr({
      "href": path
    })
    .text("Custom Sprite Repositories");
  let list_li = $("<li>")
    .append(list_li_a);
  list_li.append(listConsoles(path));
  list_ul.append(list_li);
  $("body").append(list_ul);
}

function forkMe() {
  let title = "Contribute yours!";
  let stylesheet = $("<link>")
    .attr({
      "rel": "stylesheet",
      "href": "https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css",
      "type": "text/css"
    });
  let a = $("<a>")
    .attr({
      "class": "github-fork-ribbon right-top",
      "href": "https://github.com/miketrethewey/SpriteSomething-collections/blob/gh-pages/CONTRIBUTING.md",
      "data-ribbon": title,
      "title": title
    })
    .text(title);
  $("head").append(stylesheet);
  $("body").append(a);
}

function init(mode = "index") {
  // Sanity check, only process if we've got 3 parts, will care about less parts later for console/game pages
  if (mode.indexOf('/') > -1) {
    modepieces = mode.split('/');
    if (mode.length < 3) {
      mode = "index";
    }
  }
  // Index
  if (mode == "index") {
    forkMe();
    indexPage();
  } else {
    forkMe();

    // Get console/game/sprite
    mode = mode.split('/');
    let console = mode.length > 0 ? mode[0] : "";
    let game = mode.length > 1 ? mode[1] : "";
    let sprite = mode.length > 2 ? mode[2] : "";

    listingPage(console, game, sprite);
  }
}
