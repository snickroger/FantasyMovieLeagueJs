const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/', async function(req, res, next) {
  try {
    let season = (await models.season.findAll({ limit: 1, order: [["id", "DESC"]] }))[0];
    let teams = await season.getTeams();
    let movies = await season.getMovies({ include: [models.earning, models.share] });
    let players = await teams[1].getPlayers({order: ["name"] });

    let total = players[0].getTotal(movies);

    let playersMap = players.map(p => p.name);
    res.render('index', { players: playersMap });
  } catch (e) {
    next(e);
  }
});

module.exports = router;