"use strict";

module.exports = (sequelize, DataTypes) => {
  var Share = sequelize.define("share", {
    num_shares: { type: DataTypes.INTEGER, allowNull: false }
  },
    {
      timestamps: false
    });

  Share.associate = models => {
    Share.belongsTo(models.player, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
    Share.belongsTo(models.movie, { onDelete: "CASCADE",  foreignKey: { allowNull: false } });
  }

  return Share;
};