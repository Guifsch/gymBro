import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import workoutRoutes from "./routes/workout.route.js";
import categoryRoutes from "./routes/category.route.js";
import calendarRoutes from "./routes/calendar.route.js";
import setRoutes from "./routes/set.route.js";
import cookieParser from "cookie-parser";
import path from 'path';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT, (req, res) => {
      console.log(`Servidor rodando na porta: ${process.env.PORT}.`);
    });
  })
  .catch((err) => {
    console.log(err, "ERROR");
  });

  const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


const corsOptions = {
  //configuração do cors pra não dar o erro cors e o cookie ser setado do backend de forma correta no cookies do applications usando o axios
  //To allow requests from client
  origin: ["http://localhost:5173", "http://192.168.15.7:5173"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use("/", cors(corsOptions));
// app.use(cors())

app.use(cookieParser()); //extrai as informações contidas nos cookies e as torna acessíveis para o servidor
app.use(express.json()); //middleware usado para analisar o corpo das solicitações HTTP com formato JSON

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workout", workoutRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/set", setRoutes)
app.use("/api/calendar", calendarRoutes)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    sucess: false,
    error: message,
    statusCode: statusCode,
  });
});
