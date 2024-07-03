import Workout from "../models/workout.model.js";
import Set from "../models/set.model.js";

import { errorHandler } from "../utils/error.js";

export const postSet = async (req, res, next) => {
  const { name, comment, selectedItems } = req.body;

  try {
    // const workouts = await Workout.find({ _id: { $in: selectedItems } });

    // if (workouts.length !== selectedItems.length) {
    //   return next(
    //     errorHandler(400, "Um ou mais IDs de exercícios são inválidos!")
    //   );
    // }

    const newSet = new Set({
      name,
      comment,
      selectedItems: selectedItems,
    });

    await newSet.save();

    res
      .status(201)
      .json({ message: "Grupo criado com sucesso", group: newSet });
  } catch (error) {
    // if (error._message.includes("Set validation failed")){
    //   return next(
    //     errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
    //   );
    // }
    next(error);
  }
};

export const getSet = async (req, res, next) => {
  try {
    const groups = await Set.find().populate("selectedItems");
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

export const updateSet = async (req, res, next) => {
  const { id } = req.params;
  const { name, comment, selectedItems } = req.body;

  try {
    // Verificar se os IDs dos exercícios são válidos
    // const workouts = await Workout.find({ _id: { $in: selectedItems } });

    if (!selectedItems.length) {
      return next(
        errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
      );
    }

    // Atualizar o set
    const updatedSet = await Set.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          comment: comment,
          selectedItems: selectedItems,
        },
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedSet) {
      return next(
        errorHandler(404, "Grupo não encontrado!")
      );
    }

    res
      .status(200)
      .json({ message: "Grupo atualizado com sucesso", group: updatedSet });
  } catch (error) {
    if (error._message && error._message.includes("Validation failed")) {
      return next(
        errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
      );
    }
    next(error);
  }
};

export const deleteSets = async (req, res, next) => {
  const id  = req.params.id;

  try {
    await Set.findByIdAndDelete(id);
    res.status(200).json("Set deletado com sucesso!");
  } catch (error) {
    next(error);

  }
};