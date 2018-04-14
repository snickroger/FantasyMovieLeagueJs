function changeTeam(e, seasonSlug) {
  var team = jQuery(e.target).val();
  window.location = '/'+team+'?season='+seasonSlug;
}

var SORT = {
  selectedAttr: null,
  selectedDir: null,
  defaults: {
    releaseDate: { attr: "release-date", dir: "asc"},
    title: { attr: "title", dir: "asc" },
    shares: { attr: "shares", dir: "desc" },
    gross: { attr: "gross", dir: "desc" },
    rating: { attr: "rating", dir: "desc" },
    value: { attr: "value", dir: "desc" }
  }
}

function sort(s) {
  var dir;
  if (s.attr === SORT.selectedAttr && SORT.selectedDir === "asc") {
    dir = "desc";
  } else if (s.attr === SORT.selectedAttr && SORT.selectedDir === "desc") {
    dir = "asc";
  } else {
    dir = s.dir;
  }
  
  tinysort('#movies div.movie-box', {data: s.attr, order: dir});
  SORT.selectedAttr = s.attr;
  SORT.selectedDir = dir;

  return false;
}