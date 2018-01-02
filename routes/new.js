const fs = require('fs');
const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');
const UrlDownloader = require('../modules/urlDownloader.js');
const config = require('config');

router.get('/', async function(req, res, next) {
  try {
    res.send('');
  } catch (e) {
    next(e);
  }
});

router.get('/posters', async function(req, res, next) {
    try {
        const downloadImage = async image => {
            let imageData = await downloader.download(image.posterUrl, { encoding: null });
            fs.writeFileSync(`public/images/${image.id}.jpg`, imageData);
        };
        const downloader = new UrlDownloader();
        const imdbApiUrl = "https://imdb.p.mashape.com/movie";
        const imdbApiUrlOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "X-Mashape-Key": config.get("imdbApiKey")
            },
            body: "",
            json: true
        };
        let season = (await models.season.findAll({ limit: 1, order: [["id", "DESC"]], include: [models.movie] }))[0];
        let promises = [];
        for (let movie of season.movies) {
            let imdbId = movie.imdb.replace('http://www.imdb.com/title/', '');
            imdbApiUrlOptions.body = `searchTerm=${imdbId}`;

            promises.push(downloader.download(imdbApiUrl, imdbApiUrlOptions));
        }

        let responses = await Promise.all(promises);
        let imagesToDownload = responses.map(r => { return { id: `tt${r.result.id.toString().padStart(7,'0')}`, posterUrl: r.result.poster }; });
        promises = [];
        for (let image of imagesToDownload) {
            promises.push(downloadImage(image));
        }
        await Promise.all(promises);
        res.redirect('/');
    } catch (e) {
        next(e);
    }
});

module.exports = router;