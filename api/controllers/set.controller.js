import Workout from "../models/workout.model.js";
import Set from "../models/set.model.js";


import { errorHandler } from "../utils/error.js";

export const postSet = async (req, res, next) => {
  const { name, comment, selectedItems } = req.body;

  try {
    const workouts = await Workout.find({ '_id': { $in: selectedItems } });

    if (workouts.length !== selectedItems.length) {
     
      return  next(errorHandler(400, "Um ou mais IDs de exercícios são inválidos!"));
    }

    const newSet = new Set({
      name,
      comment,
      selectedItems: selectedItems
    });

    await newSet.save();

    res.status(201).json({ message: 'Grupo criado com sucesso', group: newSet });
  } catch (error) {
    next(error);
  }
};

export const getSet = async (req, res, next) => {
  try {
    const groups = await Set.find().populate('selectedItems');
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

