"use strict";
const MovieHelpers = require('./movieHelpers.js');
const Enumerable = require('linq');
const accounting = require('accounting');

class Standings {
    static getSortedStandings(season, players) {
      let movies = Enumerable.from(season.movies);
      let moviesArr = movies.toArray();
      let playerIds = Enumerable.from(players).select(p => p.id).toArray();
      let totalShares = movies.toDictionary(k => k.id, v => MovieHelpers.totalSharesByMovie(v.shares, playerIds));
      let movieEarnings = movies.toDictionary(k => k.id, v => MovieHelpers.maxEarningByMovie(v.earnings, v.percentLimit));
      let [bestMovies, worstMovies] = MovieHelpers.bestAndWorstMovies(movies);
      let standings = [];
  
      for (let player of players) {
        let total = 0;
        let bonus1 = false;
        let bonus2 = false;
        let sharesUsed = 0;
        for (let movie of moviesArr) {
          let playerShares = Enumerable.from(movie.shares).firstOrDefault(p => p.playerId == player.id);
          let movieEarned = movieEarnings.get(movie.id);
          let shareTotal = totalShares.get(movie.id);
          if (playerShares && movieEarned > 0 && shareTotal > 0) {
            total += (playerShares.num_shares / shareTotal) * movieEarned;
            sharesUsed += playerShares.num_shares;
          }

          if (bestMovies.includes(movie.id) && player.bonus1Id === movie.id) {
            bonus1 = true;
            total += season.bonusAmount;
          }
          if (worstMovies.includes(movie.id) && player.bonus2Id === movie.id) {
            bonus2 = true;
            total += season.bonusAmount;
          }
        }

        total = Math.round(total);

        standings.push({
          name: player.name,
          id: player.id,
          bonus1: bonus1,
          bonus2: bonus2,
          sharesUsed: sharesUsed,
          total: total,
          totalDisp: accounting.formatMoney(total, '$', 0),
          perShare: total/sharesUsed || 0,
          perShareDisp: MovieHelpers.formatShortCurrency(total/sharesUsed)
        });
      }
  
      let sortedStandings = Enumerable.from(standings).orderByDescending(s => s.total).toArray();
      for (let i = 0; i < sortedStandings.length; i++) {
        sortedStandings[i].rank = i+1;
      }
  
      return sortedStandings;
    }
}

module.exports = Standings;