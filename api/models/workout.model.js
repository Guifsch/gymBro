import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rep: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  serie: {
    type: String,
    required: true,
  },
  category: [categorySchema],
  exercisePicture: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
