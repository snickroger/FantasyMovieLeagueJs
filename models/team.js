"use strict";

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

  Team.prototype.getTotal = async function() {
    let movies = await season.getMovies({ include: [models.earning, models.share] });
  }

  return Team;
};