"use strict";
const MovieHelpers = require('./movieHelpers.js');
const Enumerable = require('linq');
const accounting = require('accounting');
const moment = require('moment');

class Earnings {
    static getEarnings(movies, players) {
        let earnings = [];
        let playerIds = Enumerable.from(players).select(p => p.id).toArray();
        movies = Enumerable.from(movies);
        let moviesArr = movies.toArray();
        let [bestMovies, worstMovies] = MovieHelpers.bestAndWorstMovies(movies);

        for (let movie of moviesArr) {
            let shares = MovieHelpers.totalSharesByMovie(movie.shares, playerIds);
            let gross = MovieHelpers.maxEarningByMovie(movie.earnings, movie.percentLimit);
            let value = gross / shares || 0;
            earnings.push({
                name: movie.name,
                releaseDate: moment(movie.releaseDate).format("MMM DD"),
                rating: movie.rating,
                isBestMovie: bestMovies.includes(movie.id),
                isWorstMovie: worstMovies.includes(movie.id),
                posterUrl: `/images/${movie.imdb.replace('http://www.imdb.com/title/','')}.jpg`,
                shares: shares,
                gross: gross,
                grossDisp: accounting.formatMoney(gross, '$', 0),
                grossDispShort: MovieHelpers.formatShortCurrency(gross),
                value: value,
                valueDisp: accounting.formatMoney(value, '$', 0),
                valueDispShort: MovieHelpers.formatShortCurrency(value)
            });
        }

        return earnings;
    }
}

module.exports = Earnings;