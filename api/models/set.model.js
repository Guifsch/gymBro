import mongoose from "mongoose";

// Definindo o esquema de Set
const SetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    selectedItems: [{
      type: mongoose.Schema.Types.ObjectId, // Corrigindo a referência ao tipo ObjectId
      ref: 'Workout', // Referência ao modelo Workout
      required: true,
    }]
  },
  { timestamps: true } // Adiciona os campos createdAt e updatedAt automaticamente
);

// Criando o modelo Set com base no esquema definido
const Set = mongoose.model("Set", SetSchema);

export default Set;