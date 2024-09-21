import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "../config/database";
import { Book } from "./book";
import { User } from "./user";

interface BorrowedBookAttributes {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: Date;
  returnDate: Date | null;
  rating: number | null;
}

interface BorrowedBookCreationAttributes
  extends Optional<BorrowedBookAttributes, "id" | "returnDate" | "rating"> {}

export class BorrowedBook
  extends Model<BorrowedBookAttributes, BorrowedBookCreationAttributes>
  implements BorrowedBookAttributes
{
  public id!: number;
  public bookId!: number;
  public userId!: number;
  public borrowDate!: Date;
  public returnDate!: Date | null;
  public rating!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BorrowedBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rating: {
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
    modelName: "BorrowedBook",
  }
);

Book.hasMany(BorrowedBook, { foreignKey: "bookId", as: "borrowedBooks" });
User.hasMany(BorrowedBook, { foreignKey: "userId", as: "borrowedBooks" });
BorrowedBook.belongsTo(Book, { foreignKey: "bookId", as: "book" });
BorrowedBook.belongsTo(User, { foreignKey: "userId", as: "user" });
