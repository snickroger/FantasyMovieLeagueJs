const fs = require('fs');
const express = require('express');
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');
const UrlDownloader = require('../modules/urlDownloader.js');
const config = require('config');
const accounting = require('accounting');
const moment = require('moment');
const EmailSender = require('../modules/emailSender.js');

router.get('/', async function(req, res, next) {
  try {
    let season = await models.season.getSeason(req.query.season);
    let team = {};
    if (req.query.team) {
        let teams = season.teams.filter(t => { return t.slug === req.query.team });
        if (teams.length === 0) {
            res.sendStatus(404);
            return;
        }
        team = teams[0];
    } else {
        team = season.teams[0];
    }
    season.movies = await season.getMovies({
        order: [['releaseDate'], ['id']]
    });

    for(let movie of season.movies) {
        movie.releaseDateShort = moment(movie.releaseDate).format("MMM DD");
    }

    let seasonStart = '';
    if (season.movies.length > 0) {
        seasonStart = moment(season.movies[0].releaseDate).format('YYYY/MM/DD hh:mm:ss');
    }

    let bonusAmount = accounting.formatMoney(season.bonusAmount, '$', 0);
    res.render('new', { season: season, title: season.pageTitle, seasonStart: seasonStart, bonusAmount: bonusAmount, team: team });
  } catch (e) {
    next(e);
  }
});

router.post('/', async function(req, res, next) {
    try {
        let season = await models.season.getSeason();
        let team = season.teams.filter(t => { return t.id.toString() === req.body.teamId});
        if (team.length === 0) {
            res.sendStatus(404);
            return;
        }

        let movieShares = Object.keys(req.body).filter(k => { return k.substr(0,6) === 'movie_' });
        let playerName = req.body.whoareyou;
        let bonus1 = parseInt(req.body.bonus1);
        let bonus2 = parseInt(req.body.bonus2);

        let sharesToAdd = [];
        for(let movieShare of movieShares) {
            let movieId = parseInt(movieShare.replace('movie_', ''));
            let shares = parseInt(req.body[movieShare]);
            sharesToAdd.push({
                movieId: movieId,
                shares: shares
            });
        }

        let player = await team[0].createPlayer({name: req.body.whoareyou, bonus1Id: bonus1, bonus2Id: bonus2});
        let sharePromises = sharesToAdd.map(s => { 
            return player.createShare({
                movieId: s.movieId,
                num_shares: s.shares
            }); 
        });

        await Promise.all(sharePromises);
        if (req.body.email) {
            let sender = new EmailSender();
            let movies = await season.getMovies({
                attributes: ['name', 'id'],
                order: [['releaseDate'], ['id']]
            });
            let moviesMap = {};
            for (let m of movies) {
                moviesMap[m.id] = m.name;
            }

            let messageBody = {
                "bonus1": moviesMap[bonus1],
                "bonus2": moviesMap[bonus2],
                "playerName": playerName,
                "seasonName": season.name
            };
            messageBody.movies = sharesToAdd.map(s => { 
                return {
                    name: moviesMap[s.movieId], 
                    shares: s.shares
                }
            });

            sender.sendMail(req.body.email, messageBody);
        }

        res.redirect(`/new?team=${team[0].slug}&thanks=1`);
    } catch(e) {
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

        let season = await models.season.getSeason(req.query.season);
        let movies = await season.getMovies();
        let promises = [];

        for (let movie of movies) {
            if (!movie.imdb) {
                continue;
            }
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