"use strict";

const models = require('../models');
const input = require('readline-sync');

let seasonSlug = input.question('Select season (enter slug): ');
getSeason(seasonSlug).then(season => {
  if (!season) {
    console.error(`Season '${seasonSlug}' not found`);
    process.exit(1);
  }
  
  let teamSlug = input.question('Team name (enter slug): ');
  let teams = season.teams.filter(t => t.slug === teamSlug);
  if (!teams) {
    console.error(`Team '${teamSlug}' not found`);
    process.exit(1);
  }
  let playerInput = input.question('Player name or ID: ');
  let players = [];

  if (isNaN(playerInput)) {
    players = teams[0].players.filter(p => p.name === playerInput);
  } else {
    players = teams[0].players.filter(p => p.id === parseInt(playerInput));    
  }

  let playersStr = players.map(p => `${p.name} (ID ${p.id}; Created ${p.createdAt})`);
  let indexToDelete = input.keyInSelect(playersStr, 'Which one?');
  let playerToDelete = players[indexToDelete];
  
  return playerToDelete.destroy();
}).then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err.toString());
  process.exit(1);
});

function getSeason(seasonSlug) {
  return models.season.findOne({
    where:{
      slug:seasonSlug
    },
    include:{
      model:models.team,
      include:[
        models.player
      ]
    },
    order:[
      [models.team,models.player,'id','asc']
    ]
  });
}
