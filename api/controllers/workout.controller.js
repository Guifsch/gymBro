import Workout from "../models/workout.model.js";
import Category from "../models/category.model.js";


import { errorHandler } from "../utils/error.js";

// export const getWorkout = async (req, res, next) => {
//   const allExercisesPhotos = await Workout.find({}).sort({
//     createdAt: -1,
//   });
//   res.json(allExercisesPhotos);
// };

export const postWorkouts = async (req, res, next) => {
  if (!req.body.name || !req.body.exercisePicture) {
    return next(
      errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
    );
  }
  const newWorkout = new Workout({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const saveNewWorkout = await newWorkout.save();
    res.status(201).json(saveNewWorkout);
  } catch (error) {
    next(error);
  }
};

export const postCategorys = async (req, res, next) => {
  if (!req.body) {
    return next(
      errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
    );
  }
  const newCategorys = new Category({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const saveNewCategorys = await newCategorys.save();
    res.status(201).json(saveNewCategorys);
  } catch (error) {
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

export const getCategorys = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const categorys = await Category.find({ userId });
    res.status(200).json(categorys);
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
          set: req.body.set,
          exercisePicture: req.body.exercisePicture,
          category: req.body.category
          ,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedWorkout);
  } catch (error) {
    next(error, "error");
  }
};


export const updateWorkoutsCategorys = async (req, res, next) => {

  const { id } = req.params;
  const { categoryItems } = req.body;

  try {
    // Verificar se há duplicatas em categoryItems do corpo da requisição
    const names = categoryItems.map(item => item.name);
    const duplicatesInRequest = names.filter((item, index) => names.indexOf(item) !== index);

    if (duplicatesInRequest.length > 0) {
      return next(
        errorHandler(400, `Itens duplicados na requisição: ${duplicatesInRequest.join(', ')}`)
      );
    }

    const item = await Category.findById(id);

    // Se o item não for encontrado, retorna uma resposta 404
    if (!item) {
      return next(
        errorHandler(404, "Item não encontrado!")
      );
    }

    // Cria um array com os nomes das categorias existentes no item
    const existingNames = item.categoryItems.map(findItem => findItem.name);

    // Verificar se há duplicatas entre a requisição e os itens existentes
    const duplicatesWithExisting = names.filter(name => existingNames.includes(name));

    if (duplicatesWithExisting.length > 0) {
      return next(
        errorHandler(400, `Itens duplicados com os existentes: ${duplicatesWithExisting.join(', ')}`)
      );
    }

    // Cria um array para armazenar novos itens de categoria que serão adicionados
    const updatedCategoryItems = [];

    // Itera sobre cada novo item de categoria enviado na requisição
    categoryItems.forEach(newItem => {
      // Encontra o índice do item no array existente pelo nome
      const index = existingNames.indexOf(newItem.name);

      // Se o item já existir (índice > -1), atualiza-o
      if (index > -1) {
        // Combina o item existente com o novo item usando o operador spread
        item.categoryItems[index] = { ...item.categoryItems[index].toObject(), ...newItem };
      } else {
        // Se o item não existir, adiciona-o ao array de novos itens
        updatedCategoryItems.push(newItem);
      }
    });

    // Adiciona todos os novos itens ao array de categorias do item
    updatedCategoryItems.forEach(newItem => item.categoryItems.push(newItem));

    await item.save();
    res.status(200).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
}



export const deleteWorkoutsCategorys = async (req, res, next) => {
  const { itemId, categoryItemId } = req.params;

  try {
      const item = await Category.findById(itemId);

      // Se o item não for encontrado, retorna uma resposta 404
      if (!item) {
        return next(
          errorHandler(404, "Item não encontrado!")
        );
      }

      // Filtra o array 'categoryItems', removendo o item com o '_id' correspondente a 'categoryItemId'
      item.categoryItems = item.categoryItems.filter(
          categoryItem => categoryItem._id.toString() !== categoryItemId
      );

      // Se 'categoryItems' estiver vazio após a remoção, exclui o item inteiro
      if (item.categoryItems.length === 0) {
        await Category.findByIdAndDelete(itemId);
        return res.status(200).send({ message: "Categoria e todos os seus itens foram excluídos." });
      }

      await item.save();
      res.status(200).send(item);
  } catch (error) {
      next(error);
  }
}