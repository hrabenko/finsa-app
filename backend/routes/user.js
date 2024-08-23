import express from "express";
import {checkUser, getUser, updatePassword, updateUser} from "../controllers/user.js";


const router = express.Router();

router.get("/:id", getUser);
router.post("/", updateUser);
router.post("/user-password", updatePassword);
router.post("/user-existing/:username", checkUser);

export default router;