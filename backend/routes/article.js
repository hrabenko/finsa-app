import express from "express";
import {getAllArticles, getOneArticle, createArticle, updateArticle, deleteArticle} from "../controllers/article.js";

const router = express.Router();

router.get("/", getAllArticles);
router.get("/:id", getOneArticle);
router.post("/", createArticle);
router.post("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;