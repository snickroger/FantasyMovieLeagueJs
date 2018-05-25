const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');

router.get('/:id(\\d+)', async function (req, res, next) {
  try {
    let movieId = parseInt(req.params.id);
    let teamId = parseInt(req.query.team);

    let team = await models.team.findOne({
      where: { id: teamId }
    });

    if (!team) {
      res.status(404).send('Team not found');
      return;
    }

    let selectedMovie = await models.movie.findOne({
      where: { id: movieId },
      include: [models.earning, models.share]
    });

    let movieEarnings = await team.getMovieEarnings(selectedMovie);

    res.render('movie', { title: `${selectedMovie.name} | Earnings`, movie: movieEarnings.tableData, chart: movieEarnings.chartData, team: team });
  } catch (e) {
    next(e);
  }
});

module.exports = router;