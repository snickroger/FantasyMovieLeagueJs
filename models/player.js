"use strict";

module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define("player", {
    name: { type: DataTypes.STRING, allowNull: false }
  },
    {
      timestamps: true
    });

  Player.associate = models => {
    Player.belongsTo(models.season, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
    Player.belongsToMany(models.team, { through: 'player_team' });
    Player.belongsTo(models.movie, { as: 'bonus1', foreignKey: 'bonus1Id' });
    Player.belongsTo(models.movie, { as: 'bonus2', foreignKey: 'bonus2Id' });
  }

  return Player;
};