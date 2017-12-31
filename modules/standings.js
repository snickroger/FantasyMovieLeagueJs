"use strict";
const Enumerable = require('linq');
const accounting = require('accounting');

class Standings {
    static getSortedStandings(season, players) {
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
          let movies = Enumerable.from(season.movies);
          let moviesArr = movies.toArray();
          let playerIds = Enumerable.from(players).select(p => p.id).toArray();
          let totalShares = movies.toDictionary(k => k.id, v => totalSharesByMovie(v.shares, playerIds));
          let movieEarnings = movies.toDictionary(k => k.id, v => maxEarningByMovie(v.earnings, v.percentLimit));
          let bestMovieRating = movies.where(m => m.rating != null).max(m => m.rating);
          let worstMovieRating = movies.where(m => m.rating != null).min(m => m.rating);
          let bestMovies = movies.where(m => m.rating === bestMovieRating).select(m => m.id).toArray();
          let worstMovies = movies.where(m => m.rating === worstMovieRating).select(m => m.id).toArray();
          let standings = [];
      
          for (let player of players) {
            let total = 0;
            let rank = 1;
            let bonus1 = false;
            let bonus2 = false;
            for (let movie of moviesArr) {
              let playerShares = Enumerable.from(movie.shares).firstOrDefault(p => p.playerId == player.id);
              let movieEarned = movieEarnings.get(movie.id);
              let shareTotal = totalShares.get(movie.id);
              if (playerShares && movieEarned > 0 && shareTotal > 0) {
                total += (playerShares.num_shares / shareTotal) * movieEarned;
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
              total: total,
              totalDisp: accounting.formatMoney(total, '$', 0)
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