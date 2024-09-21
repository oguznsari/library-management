import express from "express";
import { body, param } from "express-validator";
import { validate } from "../middleware/validationMiddleware";

import {
  getBooks,
  getBookById,
  createBook,
} from "../controllers/booksController";

const router = express.Router();

router.get("/", getBooks);

router.get(
  "/:id",
  param("id").isInt().withMessage("Book ID must be an integer"),
  validate,
  getBookById
);

router.post(
  "/",
  body("name").isString().withMessage("Name is required"),
  body("averageRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  validate,
  createBook
);

export default router;
