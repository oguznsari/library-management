import express from "express";
import { body, param } from "express-validator";
import { validate } from "../middleware/validationMiddleware";

import {
  getUsers,
  createUser,
  getUser,
  borrowBook,
  returnBook,
} from "../controllers/usersController";

const router = express.Router();

router.get("/", getUsers);

router.get(
  "/:id",
  param("id").isInt().withMessage("User ID must be an integer"),
  validate,
  getUser
);

router.post(
  "/",
  body("name").isString().withMessage("Name is required"),
  validate,
  createUser
);

router.post(
  "/:id/borrow/:bookId",
  param("id").isInt().withMessage("User ID must be an integer"),
  param("bookId").isInt().withMessage("Book ID must be an integer"),
  validate,
  borrowBook
);

router.post(
  "/:id/return/:bookId",
  param("id").isInt().withMessage("User ID must be an integer"),
  param("bookId").isInt().withMessage("Book ID must be an integer"),
  body("score")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Score must be between 0 and 5"),
  validate,
  returnBook
);

export default router;
