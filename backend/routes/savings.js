import express from "express";
import {getAllSavings, createSavings, updateSavings, deleteSavings} from "../controllers/savings.js";

const router = express.Router();

router.get("/:id", getAllSavings);
router.post("/", createSavings);
router.post("/:id", updateSavings);
router.delete("/:id", deleteSavings);

export default router;