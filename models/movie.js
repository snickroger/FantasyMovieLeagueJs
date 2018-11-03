"use strict";

module.exports = (sequelize, DataTypes) => {
  var Movie = sequelize.define("movie", {
    name: { type: DataTypes.STRING, allowNull: false },
    mappedName: { type: DataTypes.STRING },
    plot: { type: DataTypes.STRING },
    actors: { type: DataTypes.STRING },
    director: { type: DataTypes.STRING },
    releaseDate: { type: DataTypes.DATE, allowNull: false },
    imdb: { type: DataTypes.STRING },
    rottenTomatoesUrl: { type: DataTypes.STRING },
    rating: { type: DataTypes.INTEGER },
    limited: { type: DataTypes.BOOLEAN, allowNull: false },
    percentLimit: { type: DataTypes.INTEGER },
    metacriticUrl: { type: DataTypes.STRING }
  },
    {
      timestamps: false
    });

  Movie.associate = models => {
    Movie.belongsTo(models.season, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
    Movie.hasMany(models.earning);
    Movie.hasMany(models.share);
  }

  return Movie;
};