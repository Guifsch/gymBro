import Calendar from "../models/calendar.model.js";
import { errorHandler } from "../utils/error.js";

// export const postCalendar = async (req, res, next) => {
//   const userId = req.user.id
//   const { name, start,comment, selectedItems } = req.body;
  

//   const newCalendar = new Calendar({
//     name,
//     userId,
//     start,
//     comment,
//     selectedItems: selectedItems,
//   });

//   try {

//     await newCalendar.save();
//     res
//       .status(201)
//       .json({ message: "Grupo criado com sucesso" });
//   } catch (error) {
//     // if (error._message.includes("Set validation failed")){
//     //   return next(
//     //     errorHandler(400, "Por favor preencha todos os campos obrigatórios!")
//     //   );
//     // }
//     next(error);
//   }
// };

export const postCalendar = async (req, res, next) => {
  const userId = req.user.id;
  const { calendarItems } = req.body;

  try {
    // Verificar se já existe um calendário para o usuário
    let calendar = await Calendar.findOne({ userId });

    if (!calendar) {
      // Se o calendário não existe, criar um novo
      const newCalendar = new Calendar({
        userId,
        calendarItems,
      });

      await newCalendar.save();
      return res.status(201).json({ message: "Calendário criado com sucesso", calendar: newCalendar });
    } else {
      // Atualizar o calendário existente
      calendar.calendarItems = calendarItems.map(item => {
        return {
          name: item.name,
          start: item.start,
          comment: item.comment,
          selectedItems: item.selectedItems,
        };
      });

      await calendar.save();
      return res.status(200).json({ message: "Calendário atualizado com sucesso", calendar });
    }
  } catch (error) {
    next(error);
  }
};

export const getCalendar = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const calendar = await Calendar.find({ userId })
      .populate({
        path: 'calendarItems',
        populate: {
          path: 'selectedItems',
          model: 'Workout'
        }
      });
    res.status(200).json(calendar);
  } catch (error) {
    next(error);
  }
};