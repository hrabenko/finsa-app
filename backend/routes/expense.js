import express from "express";
import {getAllExpenses, createExpense, updateExpense, deleteExpense} from "../controllers/expense.js";

const router = express.Router();

router.get("/:id", getAllExpenses);
router.post("/", createExpense);
router.post("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;