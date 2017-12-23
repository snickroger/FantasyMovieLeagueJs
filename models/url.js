"use strict";

module.exports = (sequelize, DataTypes) => {
  var Url = sequelize.define("url", {
    url: { type: DataTypes.STRING, allowNull: false }
  },
    {
      timestamps: false
    });

  Url.associate = models => {
    Url.belongsTo(models.season, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
  }

  return Url;
};