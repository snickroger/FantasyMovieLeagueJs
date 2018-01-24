"use strict";

const models = require('../models');
const input = require('readline-sync');

let name = input.question('New season name: ');
let defaultPageTitle = `Fantasy Movie League | ${name}`;
let pageTitle = input.question(`Page title [${defaultPageTitle}]: `, {
  defaultInput: defaultPageTitle
});
let slug = input.question('URL slug: ');

saveNewSeason(name, pageTitle, slug).then(season => {
  console.log(`Created season ID ${season.id}`);
  process.exit(0);
}).catch(err => {
  console.error(e.toString());
  process.exit(1);
});

function saveNewSeason(name, pageTitle, slug) {
  return models.season.create({
    name: name,
    pageTitle: pageTitle,
    slug: slug,
    bonusAmount: 5000000
  });
}