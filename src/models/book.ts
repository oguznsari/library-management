import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "../config/database";

interface BookAttributes {
  id: number;
  title: string;
  averageRating: number | null;
}

interface BookCreationAttributes
  extends Optional<BookAttributes, "id" | "averageRating"> {}

export class Book
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  public id!: number;
  public title!: string;
  public averageRating!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
  },
  {
    sequelize,
    modelName: "Book",
  }
);
