import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/AuthRoutes.js";
import produtosRoutes from "./routes/ProdutosRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api", produtosRoutes);

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Página não encontrada</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #ff8c1a;
        }
        .container img {
          max-width: 100%;
          height: auto;
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="/static/404.jpeg" alt="404 Smarty Entregas">
      </div>
    </body>
    </html>
  `);
});

export default app;
