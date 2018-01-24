"use strict";
const Enumerable = require('linq');

class MovieHelpers {
    static totalSharesByMovie(shares, players) {
        return Enumerable.from(shares)
            .where(v => players.includes(v.playerId))
            .select(v => v.num_shares)
            .sum();
    }

    static maxEarningByMovie(earnings, limit) {
        let maxEarning = earnings.length == 0 ? 0 : 
            Enumerable.from(earnings)
            .orderByDescending(e => e.createdAt)
            .first()
            .gross;
        return limit ? (limit/100)*maxEarning : maxEarning
    }

    static formatShortCurrency(value) {
        if (value >= 1e9)
            return (value/1e9).toPrecision(3) + "b";
        if (value >= 1e6)
            return (value/1e6).toPrecision(3) + "m";
        if (value >= 1e3)
            return (value/1e3).toPrecision(3) + "k";
        return "";
    }

    static bestAndWorstMovies(movies) {
        if (!movies.any()) {
            return [[],[]];
        }
        let bestMovieRating = movies.where(m => m.rating != null).max(m => m.rating);
        let worstMovieRating = movies.where(m => m.rating != null).min(m => m.rating);
        let bestMovies = movies.where(m => m.rating === bestMovieRating).select(m => m.id).toArray();
        let worstMovies = movies.where(m => m.rating === worstMovieRating).select(m => m.id).toArray();

        return [bestMovies, worstMovies];
    }
}

module.exports = MovieHelpers;