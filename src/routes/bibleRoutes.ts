import { Router } from "express";
import {
  getAllChaptersByBook,
  getChapter,
} from "../controllers/bibleController";

const bibleRoutes = Router();

bibleRoutes.get("/chapter/:chapter_id", getChapter);

bibleRoutes.get("/book-chapters/:book_id", getAllChaptersByBook);

export default bibleRoutes;
