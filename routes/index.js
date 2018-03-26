const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/', async function(req, res, next) {
  try {
    res.send(200);
  } catch (e) {
    next(e);
  }
});

router.get('/:teamId', async function(req, res, next) {
  try {
    res.redirect(307, '/new');
    /*
    let season = await models.season.getSeason(req.query.season);
    if (!season) {
      res.send(404);
      return;
    }
    let team = season.teams.filter(t => t.slug === req.params.teamId)[0];
    if (!team) {
      res.send(404);
      return;
    }
    let standings = await team.getStandings();
    let earnings = await team.getEarnings();

    res.render('index', { standings: standings, earnings: earnings, teamId: team.id });
    */
  } catch (e) {
    next(e);
  }
});

module.exports = router;