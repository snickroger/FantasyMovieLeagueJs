const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/', async function(req, res, next) {
  try {
    let season = (await models.season.findAll({ limit: 1, order: [["id", "DESC"]], include: [models.team] }))[0];
    let standings = await season.teams[0].getStandings();
    let earnings = await season.teams[0].getEarnings();

    res.render('index', { standings: standings, earnings: earnings });
  } catch (e) {
    next(e);
  }
});

module.exports = router;