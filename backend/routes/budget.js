import express from "express";
import {getAllBudgets, getOneBudget, createBudget, updateBudget, deleteBudget} from "../controllers/budget.js";

const router = express.Router();

router.get("/:id", getAllBudgets);
router.get("/budget/:id", getOneBudget);
router.post("/", createBudget);
router.post("/budget/:id", updateBudget);
router.delete("/budget/:id", deleteBudget);

export default router;