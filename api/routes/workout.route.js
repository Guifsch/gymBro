import express from "express";
import {
  deleteWorkouts,
  getWorkouts,
  postWorkouts,
  updateWorkouts,
  postCategorys,
  getCategorys,
  updateWorkoutsCategorys,
  deleteWorkoutsCategorys
} from "../controllers/workout.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/workouts", verifyToken, postWorkouts);
router.post("/categorys", verifyToken, postCategorys);
router.get("/workouts", verifyToken, getWorkouts);
router.get("/categorys", verifyToken, getCategorys);
router.delete("/workouts/:id", verifyToken, deleteWorkouts);
router.post("/update/:id", verifyToken, updateWorkouts);
router.put("/updateCategory/:id", verifyToken, updateWorkoutsCategorys);
router.delete("/categorys/:itemId/categoryItems/:categoryItemId", verifyToken, deleteWorkoutsCategorys);


export default router;


