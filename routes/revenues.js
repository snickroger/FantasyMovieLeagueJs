const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');
const UrlDownloader = require('../modules/urlDownloader.js');
const MojoParser = require('../modules/mojoParser.js');
const RtParser = require('../modules/rtParser.js');
const moment = require('moment-timezone');

router.get('/', async function(req, res, next) {
  try {
    let dateStr = moment().tz("America/New_York").format("YYYY-MM-DD");
    let dateStrThreshold = moment().add(5, 'days').tz("America/New_York").format("YYYY-MM-DD");
    let season = await models.season.getSeason(null);
    let moviesPromise = season.getMovies({ where: { releaseDate: { lte: dateStrThreshold } } });
    let urlsPromise = season.getUrls();
  
    let earningsClearPromise = models.earning.destroy({
      where: {
        createdAt: sequelize.where(sequelize.fn("date", sequelize.col("createdAt")), dateStr)
      }
    });

    let downloader = new UrlDownloader();
    let mojoParser = new MojoParser();
    let rtParser = new RtParser();
    let earnings = [];
    let [movies, urls] = await Promise.all([moviesPromise, urlsPromise]);

    for(let url of urls) {
      let html = await downloader.download(url.url);
      let rows = mojoParser.parse(html);
      let moviesMap = movies.map(m => { return { id: m.id, name: m.mappedName || m.name } });
      let earningsToAdd = mojoParser.getEarnings(rows, moviesMap);
      earnings = earnings.concat(earningsToAdd);
    }

    await earningsClearPromise;
    let earningsPromise = models.earning.bulkCreate(earnings);
    let earningsStr = earnings.map(e => `${e.name}: ${e.grossStr}`).join("\n");

    let rtMovies = movies.map(m => { return { id: m.id, url: m.rottenTomatoesUrl, name: m.name } });
    let ratingsPromises = [];
    let ratingsStr = "";

    for(let rm of rtMovies) {
      let html = await downloader.download(rm.url);
      let rating = rtParser.parse(html);
      ratingsPromises.push(models.movie.update(
        { rating: rating }, 
        { where: { id: rm.id } }
      ));
      ratingsStr += `${rm.name}: ${rating}%\n`;
    }

    await earningsPromise;
    await Promise.all(ratingsPromises);

    res.header("Content-Type", "text/plain");
    res.send(`${earningsStr}\n\n${ratingsStr}`);

  } catch(e) {
    next(e);
  }
});

module.exports = router;
