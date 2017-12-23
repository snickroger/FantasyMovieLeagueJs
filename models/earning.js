"use strict";

module.exports = (sequelize, DataTypes) => {
  var Earning = sequelize.define("earning", {
    gross: { type: DataTypes.INTEGER, allowNull: false },
  },
    {
      timestamps: true
    });

  Earning.associate = models => {
    Earning.belongsTo(models.movie, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
  }

  return Earning;
};