import express from "express";
import {
  postSet,
  getSet

} from "../controllers/set.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/sets", verifyToken, postSet);
router.get("/sets", verifyToken, getSet);


export default router;


