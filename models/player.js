"use strict";

module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define("player", {
    name: { type: DataTypes.STRING, allowNull: false },
    enteredMoneyPool: { type:DataTypes.BOOLEAN, allowNull: false }
  },
    {
      timestamps: true
    });

  Player.associate = models => {
    Player.belongsToMany(models.team, { through: models.player_team });
    Player.belongsTo(models.movie, { as: 'bonus1', foreignKey: 'bonus1Id' });
    Player.belongsTo(models.movie, { as: 'bonus2', foreignKey: 'bonus2Id' });
    Player.hasMany(models.share);
  }

  return Player;
};