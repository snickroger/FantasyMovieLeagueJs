const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/', async function (req, res, next) {
  try {
    let seasons = await models.season.findAll({'order': [['id', 'DESC']], 'attributes': ['name','slug']});
    let season = await models.season.getSeason(req.query.season);
    if (!season) {
      res.send(404);
      return;
    }

    let startDate = await season.getStartDate();
    if (startDate > new Date() && req.query.skip !== "1") {
      res.redirect(307, '/new');
    }

    let teams = season.teams.map(t => { return { id: t.slug, name: t.name }});
    res.render('index_noteam', { title: season.pageTitle, teams: teams, seasons: seasons, selectedSeason: season });

  } catch (e) {
    next(e);
  }
});

router.get('/:teamId', async function (req, res, next) {
  try {
    let seasons = await models.season.findAll({'order': [['id', 'DESC']], 'attributes': ['name','slug']});
    let season = await models.season.getSeason(req.query.season);
    if (!season) {
      res.status(404).send('Season not found');
      return;
    }

    let startDate = await season.getStartDate();
    if (startDate > new Date() && req.query.skip !== "1") {
      res.redirect(307, '/new');
    }

    let team = season.teams.filter(t => t.slug === req.params.teamId)[0];
    if (!team) {
      res.status(404).send('Team not found');
      return;
    }

    let standings = await team.getStandings();
    let earnings = await team.getEarnings();
    let teams = season.teams.map(t => { return { id: t.slug, name: t.name }});

    let endDate = await season.getEndDate();

    res.render('index', { title: season.pageTitle, standings: standings, earnings: earnings, teams: teams, selectedTeam: team, seasons: seasons, selectedSeason: season, endDate: endDate });
  } catch (e) {
    next(e);
  }
});

module.exports = router;