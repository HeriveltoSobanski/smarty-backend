import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
