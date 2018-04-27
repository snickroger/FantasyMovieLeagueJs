const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    let playerId = parseInt(req.params.id);
    let teamId = parseInt(req.query.team);

    let player = await models.player.findOne({
      where: { id: playerId },
      include: [{
        model: models.team,
        where: { id: teamId }
      }]
    });

    if (!player || player.teams.length == 0) {
      res.send(404);
      return;
    }

    let playerEarnings = await player.teams[0].getPlayerEarnings(player);

    res.render('players', { title: `${player.name} | Earnings`, player: playerEarnings, team: player.teams[0] });
  } catch (e) {
    next(e);
  }
});

module.exports = router;