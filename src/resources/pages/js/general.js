// Sort Fetch response HTTP status code
function httpstatus(response) {
  if(response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText || "No status text"))
  }
}
// Return JSON if JSON, otherwise text
function parse(response) {
  const contentType = response.headers.get("content-type")
  if(contentType && contentType.includes("application/json")) {
    return response.json()
  } else {
    return response.text()
  }
}
// os.path.join()
function path_join(parts=[""]) {
  return parts.join(path_sep(parts[0]))
}
// os.path.sep
function path_sep(url=window.location.href) {
  let thisSep = "win"
  if(url.includes("http")) {
    thisSep = "nix"
  }
  if(thisSep == "win") {
    return '\\'
  } else if(thisSep == "nix") {
    return '/'
  }

  // default to *nix system.
  return '/'
}
