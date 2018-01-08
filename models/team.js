"use strict";
const Standings = require('../modules/standings.js');
const Earnings = require('../modules/earnings.js');

module.exports = (sequelize, DataTypes) => {
  var Team = sequelize.define("team", {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false }
  },
    {
      timestamps: false
    });

  Team.associate = models => {
    Team.belongsTo(models.season, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
    Team.belongsToMany(models.player, { through: models.player_team });
  }

  Team.prototype.getStandings = async function() {
    let seasonP = this.getSeason({ 
      include: [{
        model: sequelize.models.movie, 
        include: [sequelize.models.earning, sequelize.models.share] 
      }]
    });
    let playersP = this.getPlayers();
    let [season, players] = await Promise.all([seasonP, playersP]);

    return Standings.getSortedStandings(season, players);
  }

  Team.prototype.getEarnings = async function() {
    let seasonP = this.getSeason({ 
      include: [{
        model: sequelize.models.movie, 
        include: [sequelize.models.earning, sequelize.models.share] 
      }],
      order: [[sequelize.models.movie, 'releaseDate'], [sequelize.models.movie, 'id']]
    });
    let playersP = this.getPlayers();
    let [season, players] = await Promise.all([seasonP, playersP]);
    
    return Earnings.getEarnings(season.movies, players);
  }

  Team.prototype.getPlayerEarnings = async function(selectedPlayer) {
    let seasonP = this.getSeason({ 
      include: [{
        model: sequelize.models.movie, 
        include: [sequelize.models.earning, sequelize.models.share] 
      }],
      order: [[sequelize.models.movie, 'releaseDate'], [sequelize.models.movie, 'id']]
    });
    let playersP = this.getPlayers({include: [sequelize.models.share]});
    let [season, players] = await Promise.all([seasonP, playersP]);

    return Earnings.getPlayerEarnings(season.movies, players, selectedPlayer, season.bonusAmount);
  }

  return Team;
};