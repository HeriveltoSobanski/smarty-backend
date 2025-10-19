// /Backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware padrão
app.use(cors());
app.use(express.json());

// Rota principal para testar
app.get("/", (req, res) => {
  res.json({ mensagem: "API Smarty Entregas rodando com sucesso!" });
});

// Prefixo da API
app.use("/api/auth", AuthRoutes);

// Teste de conexão com o banco
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com PostgreSQL estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
})();
