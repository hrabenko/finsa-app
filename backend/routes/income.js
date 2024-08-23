import express from "express";
import {getAllIncome, createIncome, updateIncome, deleteIncome} from "../controllers/income.js";

const router = express.Router();

router.get("/:id", getAllIncome);
router.post("/", createIncome);
router.post("/:id", updateIncome);
router.delete("/:id", deleteIncome);

export default router;