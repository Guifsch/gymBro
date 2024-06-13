import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rep:{
      type: String,
      required: true,
    },
   weight: {
      type: String,
      required: true,
    },
    set: {
      type: String,
      required: true,
    },
    exercisePicture: {
      type: String,
      required: true,
    }
  },
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
