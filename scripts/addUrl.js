"use strict";

const models = require('../models');
const input = require('readline-sync');
const { URL } = require('url');

let seasonSlug = input.question('Select season (enter slug): ');
getSeason(seasonSlug).then(season => {
  if (!season) {
    console.error(`Season '${seasonSlug}' not found`);
    process.exit(1);
  }
  
  let urlInput = input.question('Enter URL: ');
  let validatedUrl = new URL(urlInput);

  return Promise.all([season, saveNewUrl(season, validatedUrl.toString())]);
}).then(p => {
  console.log(`Added URL for season '${p[0].slug}'`);
  process.exit(0);
}).catch(err => {
  console.error(err.toString());
  process.exit(1);
})

function getSeason(seasonSlug) {
  return models.season.findOne({ where: { slug: seasonSlug } });
}

function saveNewUrl(season, url) {
  return season.createUrl({
    url: url
  });
}