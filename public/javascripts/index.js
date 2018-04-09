function changeTeam(e, seasonSlug) {
  var team = jQuery(e.target).val();
  window.location = '/'+team+'?season='+seasonSlug;
}