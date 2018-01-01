"use strict";
const Enumerable = require('linq');
const accounting = require('accounting');

class Earnings {
    static getEarnings(movies, players) {
        let earnings = [];
        let totalSharesByMovie = (shares, players) => {
            return Enumerable.from(shares)
            .where(v => players.includes(v.playerId))
            .select(v => v.num_shares)
            .sum()
            };
            let maxEarningByMovie = (earnings, limit) => { 
            let maxEarning = earnings.length == 0 ? 0 : 
                Enumerable.from(earnings)
                .orderByDescending(e => e.createdAt)
                .first()
                .gross;
            return limit ? (limit/100)*maxEarning : maxEarning;
        };
        let formatShortCurrency = value => {   
            if (value >= 1e9)
                return (value/1e9).toPrecision(3) + "b";
            if (value >= 1e6)
                return (value/1e6).toPrecision(3) + "m";
            if (value >= 1e3)
                return (value/1e3).toPrecision(3) + "k";
            return "";
        };
        let playerIds = Enumerable.from(players).select(p => p.id).toArray();
        movies = Enumerable.from(movies);
        let moviesArr = movies.toArray();
        let bestMovieRating = movies.where(m => m.rating != null).max(m => m.rating);
        let worstMovieRating = movies.where(m => m.rating != null).min(m => m.rating);
        let bestMovies = movies.where(m => m.rating === bestMovieRating).select(m => m.id).toArray();
        let worstMovies = movies.where(m => m.rating === worstMovieRating).select(m => m.id).toArray();

        for (let movie of moviesArr) {
            let gross = maxEarningByMovie(movie.earnings, movie.percentLimit);
            let value = gross / totalSharesByMovie(movie.shares, playerIds) || 0;
            earnings.push({
                name: movie.name,
                releaseDate: movie.releaseDate,
                rating: movie.rating,
                isBestMovie: bestMovies.includes(movie.id),
                isWorstMovie: worstMovies.includes(movie.id),
                imdb: movie.imdb,
                gross: gross,
                grossDisp: accounting.formatMoney(gross, '$', 0),
                grossDispShort: formatShortCurrency(gross),
                value: value,
                valueDisp: accounting.formatMoney(value, '$', 0),
                valueDispShort: formatShortCurrency(value)
            });
        }

        return earnings;
    }
}

module.exports = Earnings;