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

  Season.getSeason = async function (qsSeason) {
    var t;
    if (qsSeason) {
      t = sequelize.models.season.findOne({ where: { slug: qsSeason }, include: [sequelize.models.team] });
    } else {
      t = sequelize.models.season.findOne({ order: [["id", "DESC"]], include: [sequelize.models.team] });
    }
    return await t;
  };

  Season.prototype.getStartDate = async function () {
    let movies = await this.getMovies({ order: ['releaseDate'], limit: 1 });
    return movies[0].releaseDate;
  };

  Season.associate = models => {
    Season.hasMany(models.movie, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
    Season.hasMany(models.team);
    Season.hasMany(models.url);
  };

  return Season;
};