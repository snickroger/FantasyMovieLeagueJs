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
      let gross = MovieHelpers.maxEarningByMovie(movie.earnings);
      let value = gross / shares || 0;
      earnings.push({
        id: movie.id,
        name: movie.name,
        releaseDateInt: moment(movie.releaseDate).format('X'),
        releaseDate: moment(movie.releaseDate).format("MMM DD"),
        rating: movie.rating,
        isBestMovie: bestMovies.includes(movie.id),
        isWorstMovie: worstMovies.includes(movie.id),
        posterUrl: `/images/${(movie.imdb || '').replace('https://www.imdb.com/title/', '')}.jpg`,
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

  static getPlayerEarnings(moviesObj, players, selectedPlayer, bonusAmount) {
    let earnings = [];
    let playerId = selectedPlayer.id;
    let playerIds = Enumerable.from(players).select(p => p.id).toArray();
    let movies = Enumerable.from(moviesObj);
    let totalShares = movies.toDictionary(k => k.id, v => MovieHelpers.totalSharesByMovie(v.shares, playerIds));
    let movieEarnings = movies.toDictionary(k => k.id, v => MovieHelpers.maxEarningByMovie(v.earnings));
    let moviesArr = movies.toArray();
    let [bestMovies, worstMovies] = MovieHelpers.bestAndWorstMovies(movies);
    let total = 0;
    let bonus1 = false;
    let bonus2 = false;

    for (let movie of moviesArr) {
      let playerEarned = 0;
      let shares = Enumerable.from(movie.shares);
      let playerShares = shares.firstOrDefault(s => s.movieId == movie.id && s.playerId == selectedPlayer.id);
      let movieEarned = movieEarnings.get(movie.id);
      let sharesTotal = totalShares.get(movie.id);

      if (playerShares && sharesTotal > 0) {
        playerEarned = (playerShares.num_shares / sharesTotal) * movieEarned
        total += playerEarned;
      }

      if (bestMovies.includes(movie.id) && selectedPlayer.bonus1Id === movie.id) {
        bonus1 = true;
        total += bonusAmount;
      }

      if (worstMovies.includes(movie.id) && selectedPlayer.bonus2Id === movie.id) {
        bonus2 = true;
        total += bonusAmount;
      }

      earnings.push({
        name: movie.name,
        releaseDate: moment(movie.releaseDate).format("MMM DD"),
        shares: playerShares !== null ? playerShares.num_shares : 0,
        earned: playerEarned,
        earnedDisp: accounting.formatMoney(playerEarned, '$', 0),
        bonus1Selected: selectedPlayer.bonus1Id === movie.id,
        bonus2Selected: selectedPlayer.bonus2Id === movie.id
      });
    }

    return {
      name: selectedPlayer.name,
      earnings: earnings,
      total: total,
      totalDisp: accounting.formatMoney(total, '$', 0),
      bonus1: bonus1,
      bonus2: bonus2,
      bonusAmount: bonusAmount,
      bonusAmountDisp: accounting.formatMoney(bonusAmount, '$', 0)
    };
  }

  static getMovieEarnings(moviesObj, players, selectedMovie) {
    let earnings = [];
    let playersArr = Enumerable.from(players).toArray();
    let playerIds = Enumerable.from(players).select(p => p.id).toArray();
    let movies = Enumerable.from(moviesObj);
    let movieEarned = MovieHelpers.maxEarningByMovie(selectedMovie.earnings);
    let movieShares = Enumerable.from(selectedMovie.shares);
    let movieSharesTotal = MovieHelpers.totalSharesByMovie(selectedMovie.shares, playerIds);
    let [bestMovies, worstMovies] = MovieHelpers.bestAndWorstMovies(movies);

    for (let player of playersArr) {
      let playerShares = movieShares.firstOrDefault(s => s.playerId === player.id);
      let playerSharesNum = playerShares !== null ? playerShares.num_shares : 0;
      let playerEarned = playerSharesNum > 0 && movieSharesTotal > 0
        ? (playerSharesNum / movieSharesTotal) * movieEarned
        : 0;

      let bonus1 = player.bonus1Id === selectedMovie.id;
      let bonus2 = player.bonus2Id === selectedMovie.id;

      earnings.push({
        name: player.name,
        bonus1: bonus1,
        bonus2: bonus2,
        shares: playerSharesNum,
        earned: playerEarned,
        earnedDisp: accounting.formatMoney(playerEarned, '$', 0)
      });
    }

    return {
      name: selectedMovie.name,
      earnings: earnings,
      total: movieEarned,
      totalDisp: accounting.formatMoney(movieEarned, '$', 0),
      totalShares: movieSharesTotal
    };
  }

  static getMovieEarningsChartData(selectedMovie) {
    let earningPoints = Enumerable.from(selectedMovie.earnings).where(e => e.createdAt.getDay() === 0)
      .orderBy(e => e.createdAt).select(e => { return { t: moment(e.createdAt).format('LL'), y: e.gross }; })
      .toArray();

    return earningPoints;
  }
}

module.exports = Earnings;