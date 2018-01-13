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

  Season.getSeason = async function(qsSeason) {
    if (qsSeason) {
      return sequelize.models.season.findOne({ where: { slug: qsSeason }, include: [sequelize.models.team] });
    } else {
      return sequelize.models.season.findOne({ order: [["id", "DESC"]], include: [sequelize.models.team] });
    }
  };

  Season.associate = models => {
    Season.hasMany(models.movie, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
    Season.hasMany(models.team);
    Season.hasMany(models.url);
  };

  return Season;
};