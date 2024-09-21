import { Request, Response } from "express";
import { Book, BorrowedBook, User } from "../models";
import { Op } from "sequelize";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the user" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const borrowBook = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const bookId = Number(req.params.bookId);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const isBorrowed = await BorrowedBook.findOne({
      where: { bookId: bookId, returnDate: null },
    });
    if (isBorrowed) {
      return res.status(400).json({ error: "Book is already borrowed" });
    }

    await BorrowedBook.create({
      bookId: bookId,
      userId: userId,
      borrowDate: new Date(),
      returnDate: null,
      rating: null,
    });

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to borrow the book" });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  console.log("amkkk");
  const userId = Number(req.params.id);
  const bookId = Number(req.params.bookId);

  const { score: rating } = req.body;
  try {
    const borrowedBook = await BorrowedBook.findOne({
      where: { bookId: bookId, userId: userId, returnDate: null },
    });

    if (!borrowedBook) {
      return res.status(400).json({ error: "Book not borrowed by this user" });
    }

    borrowedBook.returnDate = new Date();
    borrowedBook.rating = rating;

    await borrowedBook.save();
    console.log({ borrowedBook, rating, userId, bookId });

    const ratings = await BorrowedBook.findAll({
      where: { bookId: bookId, rating: { [Op.not]: null } },
    });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, b) => sum + (b.rating || 0), 0) / ratings.length
        : 0;

    const book = await Book.findByPk(bookId);
    console.log({ book, avgRating });
    if (book) {
      book.averageRating = avgRating;
      await book.save();
    }

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Failed to return the book" });
  }
};
