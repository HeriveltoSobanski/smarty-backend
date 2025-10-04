// Backend/app.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ROTAS
import authRoutes from "./routes/AuthRoutes.js";
import produtosRoutes from "./routes/ProdutosRoutes.js";
import usuariosRoutes from "./routes/UsuariosRoutes.js"; // <-- adicionado

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Healthcheck rápido
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mensagem: "Servidor rodando!" });
});

// Rota de debug para ver o body recebido
app.post("/api/_echo", (req, res) => {
  console.log("Body recebido:", req.body);
  res.json({ recebido: req.body });
});

// Pastas estáticas
const FRONTEND_PUBLIC = path.resolve(__dirname, "..", "Frontend", "public");
const BACKEND_PUBLIC = path.resolve(__dirname, "public");

// Logs de verificação
console.log(
  "[STATIC] Frontend/public:",
  FRONTEND_PUBLIC,
  fs.existsSync(FRONTEND_PUBLIC) ? "OK" : "NÃO ENCONTRADO"
);
console.log(
  "[STATIC] Backend/public :",
  BACKEND_PUBLIC,
  fs.existsSync(BACKEND_PUBLIC) ? "OK" : "NÃO ENCONTRADO"
);

// Servir arquivos estáticos se existirem
if (fs.existsSync(FRONTEND_PUBLIC)) {
  app.use("/static", express.static(FRONTEND_PUBLIC));
}
if (fs.existsSync(BACKEND_PUBLIC)) {
  app.use("/static", express.static(BACKEND_PUBLIC));
}

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);   // <-- ajustei para ficar consistente
app.use("/api/usuarios", usuariosRoutes);   // <-- adicionado corretamente

// Fallback 404 (deve ser a última rota)
app.use((req, res) => {
  res.status(404).type("html").send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>404 - Página não encontrada</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #5a5a5a;
            color: #fff;
            font-family: Arial, sans-serif;
            text-align: center;
          }
          h1 { font-size: 64px; margin: 0; }
          h2 { font-size: 24px; font-weight: 400; margin: 0; }
        </style>
      </head>
      <body>
        <div>
          <h1>404</h1>
          <h2>Página não encontrada</h2>
        </div>
      </body>
    </html>
  `);
});

export default app;
  