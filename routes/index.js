const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/', async function(req, res, next) {
  try {
    let season = (await models.season.findAll({ limit: 1, order: [["id", "DESC"]] }))[0];
    let teams = await season.getTeams();
    let standings = teams[1].getStandings();

    let earnings = await teams[1].getStandings();

    res.render('index', {players: earnings});
  } catch (e) {
    next(e);
  }
});

module.exports = router;