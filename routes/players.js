const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/:id(\\d+)', async function(req, res, next) {
  try {
    let playerId = parseInt(req.params.id);
    let playerP = models.player.findAll({ limit: 1, where: { id: playerId }});
    let seasonP = models.season.findAll({ limit: 1, order: [["id", "DESC"]], include: [models.team] });
    let [player, season] = await Promise.all([playerP, seasonP]);
    let playerEarnings = await season[0].teams[0].getPlayerEarnings(player[0]);

    res.render('players', {player: playerEarnings});
  } catch (e) {
    next(e);
  }
});

module.exports = router;