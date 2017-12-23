"use strict";

module.exports = (sequelize, DataTypes) => {
  var Season = sequelize.define("season", {
    name: { type: DataTypes.STRING, allowNull: false },
    pageTitle: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    bonusAmount: { type: DataTypes.INTEGER, allowNull: false },
    newHeaderContent: { type: DataTypes.STRING }
  },
    {
      timestamps: false
    });

  Season.associate = models => {
    Season.hasMany(models.movie, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
    Season.hasMany(models.team);
    Season.hasMany(models.url);
  }

  return Season;
};