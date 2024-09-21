import { Request, Response } from "express";
import { Book, BorrowedBook, User } from "../models"; // Assuming you've defined models for Book, BorrowedBook, and User
import { validationResult } from "express-validator";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve books" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const bookId = Number(id);
  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the book" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, averageRating } = req.body;

  try {
    const newBook = await Book.create({
      title: name,
      averageRating: averageRating !== undefined ? averageRating : 0,
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the book" });
  }
};
