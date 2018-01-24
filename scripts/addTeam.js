"use strict";

const models = require('../models');
const input = require('readline-sync');

let seasonSlug = input.question('Select season (enter slug): ');
getSeason(seasonSlug).then(season => {
  if (!season) {
    console.error(`Season '${seasonSlug}' not found`);
    process.exit(1);
  }
  
  let teamName = input.question('Team name: ');
  let slug = input.question('URL slug: ');

  return saveNewTeam(season, teamName, slug);
}).then(team => {
  console.log(`Created team ID ${team.id}`);
  process.exit(0);
}).catch(err => {
  console.error(err.toString());
  process.exit(1);
})

function getSeason(seasonSlug) {
  return models.season.findOne({ where: { slug: seasonSlug } });
}

function saveNewTeam(season, teamName, slug) {
  return season.createTeam({
    name: teamName,
    slug: slug
  });
}