const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');
const UrlDownloader = require('../modules/urlDownloader.js');
const MojoParser = require('../modules/mojoParser.js');
const MetacriticParser = require('../modules/metacriticParser.js');
const moment = require('moment-timezone');

router.get('/', async function (req, res, next) {
  try {
    let dateStr = moment().tz("America/New_York").format("YYYY-MM-DD");
    let dateStrThreshold = moment().add(5, 'days').tz("America/New_York").format("YYYY-MM-DD");
    let season = await models.season.getSeason(null);
    let moviesPromise = season.getMovies({ where: { releaseDate: { lte: dateStrThreshold } }, order: [['releaseDate', 'DESC']] });
    let urlsPromise = season.getUrls();

    let downloader = new UrlDownloader();
    let mojoParser = new MojoParser();
    let ratingParser = new MetacriticParser();
    let earnings = [];
    let [movies, urls] = await Promise.all([moviesPromise, urlsPromise]);
    
    let seasonEndDate = await season.getEndDate(movies);
    let currentTime = new Date();
    if (currentTime >= seasonEndDate) {
      res.send('');
      return;
    }

    let earningsClearPromise = models.earning.destroy({
      where: sequelize.where(sequelize.fn("date", sequelize.col("createdAt")), dateStr)
    });

    for (let url of urls) {
      let html = await downloader.download(url.url);
      let rows = mojoParser.parse(html);
      let moviesMap = movies.map(m => { return { id: m.id, name: m.mappedName || m.name, limit: m.percentLimit } });
      let earningsToAdd = mojoParser.getEarnings(rows, moviesMap);
      earnings = earnings.concat(earningsToAdd);
    }

    await earningsClearPromise;
    let earningsPromise = models.earning.bulkCreate(earnings);
    let earningsStr = earnings.map(e => `${e.name}: ${e.grossStr}`).join("\n");

    let metacriticMovies = movies.map(m => { return { id: m.id, url: m.metacriticUrl, name: m.name } });
    let ratingsPromises = [];
    let ratingsStr = "";

    for (let metacriticMovie of metacriticMovies) {
      let html = await downloader.download(metacriticMovie.url);
      let rating = ratingParser.parse(html);
      if (rating === null) {
        continue;
      }
      
      ratingsPromises.push(models.movie.update(
        { rating: rating },
        { where: { id: metacriticMovie.id } }
      ));
      ratingsStr += `${metacriticMovie.name}: ${rating}%\n`;
    }

    await earningsPromise;
    await Promise.all(ratingsPromises);

    try {
      let cacheClearPromises = [
        downloader.download('http://localhost/friends', { "headers": { "Bypass": "1" } }),
        downloader.download('http://localhost/dealeron', { "headers": { "Bypass": "1" } }),
        downloader.download(`http://localhost/friends?season=${season.slug}`, { "headers": { "Bypass": "1" } }),
        downloader.download(`http://localhost/dealeron?season=${season.slug}`, { "headers": { "Bypass": "1" } })
      ];
      await Promise.all(cacheClearPromises);
    } catch (e) {
      // no-op
    }

    res.header("Content-Type", "text/plain");
    res.header("Cache-Control", "no-cache");
    res.send(`${earningsStr}\n\n${ratingsStr}`);

  } catch (e) {
    next(e);
  }
});

module.exports = router;
