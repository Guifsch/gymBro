import Workout from "../models/workout.model.js";



import { errorHandler } from "../utils/error.js";

// export const getWorkout = async (req, res, next) => {
//   const allExercisesPhotos = await Workout.find({}).sort({
//     createdAt: -1,
//   });
//   res.json(allExercisesPhotos);
// };

export const postWorkouts = async (req, res, next) => {
  const newWorkout = new Workout({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const saveNewWorkout = await newWorkout.save();
    res.status(201).json(saveNewWorkout);
  } catch (error) {
    if (error._message.includes("Workout validation failed")){
      return next(
        errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
      );
    }
    next(error);
  }
};

export const deleteWorkouts = async (req, res, next) => {
  const id  = req.params.id;
  // erro esquisto que se tu colocar o id do usuario da successo no delete mas n deleta nada

  try {
    await Workout.findByIdAndDelete(id);
    res.status(200).json("Imagem deletada com successo!");
  } catch (error) {
    next(error);

  }
};


export const getWorkouts = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const workouts = await Workout.find({ userId });

    res.status(200).json({
      workouts,
    });
  } catch (error) {
    next(error);
  }
};


export const updateWorkouts = async (req, res, next) => {
  console.log(req.params.id)
  try {

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          rep: req.body.rep,
          weight: req.body.weight,
          serie: req.body.serie,
          exercisePicture: req.body.exercisePicture,
          category: req.body.category
          ,
        },
      },
      { new: true,
        runValidators: true 
       }
    );

    res.status(200).json(updatedWorkout);
  } catch (error) {
    if (error._message.includes("Validation failed")){
      return next(
        errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
      );
    }
    next(error, "error");
  }
};
