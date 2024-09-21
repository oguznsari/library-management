import express from "express";
import userRoutes from "./routes/users";
import bookRoutes from "./routes/books";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
