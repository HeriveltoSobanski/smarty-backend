import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", AuthRoutes);

try {
  await sequelize.authenticate();
  console.log("✅ Conexão com PostgreSQL estabelecida com sucesso!");
  await sequelize.sync();
  console.log("🗄️ Banco sincronizado com Sequelize.");
} catch (error) {
  console.error("❌ Erro ao conectar ao banco:", error);
}

export default app;
