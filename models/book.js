"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {}
  }
  Book.init(
    {
      title: DataTypes.STRING,
      averageRating: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
