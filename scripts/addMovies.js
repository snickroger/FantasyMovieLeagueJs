"use strict";

if (process.stdin.isTTY) {
  console.error("usage: npm run add-movies < movies.yml");
  process.exit(1);
}

const models = require('../models');
const input = require('readline-sync');
const yaml = require('js-yaml');

// read movies yaml file from stdin

let moviesStr = "";
process.stdin.setEncoding('utf-8');
process.stdin.on('data', d => { 
  moviesStr += d; 
});
process.stdin.on('end', () => { readYaml(moviesStr); });

function readYaml(moviesStr) {
  let movies = {};
  
  try {
    movies = yaml.safeLoad(moviesStr, { schema: yaml.FAILSAFE_SCHEMA });
    console.log(`${movies.movies.length} movies loaded`);
  } catch (e) {
    console.error(e.toString());
    process.exit(1);
  }

  let seasonSlug = input.question('Save to season (enter slug): ');
  getSeason(seasonSlug).then(season => {
    if (!season) {
      console.error(`Season '${seasonSlug}' not found`);
      process.exit(1);
    }

    return saveToSeason(season, movies.movies);
  }).then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  })
}

function getSeason(seasonSlug) {
  return models.season.findOne({ where: { slug: seasonSlug } });
}

function saveToSeason(season, movies) {
  for (let movie of movies) {
    movie.limited = movie.limited || false;
  }

  let promises = movies.map(function(movie) {
    return season.createMovie(movie);
  });

  return Promise.all(promises);
}
