"use strict";

module.exports = (sequelize, DataTypes) => {
  var PlayerTeam = sequelize.define("player_team", {},
    {
      timestamps: false
    });

  return PlayerTeam;
};