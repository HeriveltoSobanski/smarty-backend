import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ROTAS 
import authRoutes from "./routes/AuthRoutes.js";
import produtosRoutes from "./routes/ProdutosRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.post("/api/_echo", (req, res) => {
  console.log("Body recebido:", req.body);
  res.json({ recebido: req.body });
});

const FRONTEND_PUBLIC = path.resolve(__dirname, "..", "Frontend", "public");
const BACKEND_PUBLIC  = path.resolve(__dirname, "public");

// Logs informando se as pastas existem
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

if (fs.existsSync(FRONTEND_PUBLIC)) {
  app.use("/static", express.static(FRONTEND_PUBLIC));
}
if (fs.existsSync(BACKEND_PUBLIC)) {
  app.use("/static", express.static(BACKEND_PUBLIC));
}

const candidate404s = [
  path.join(FRONTEND_PUBLIC, "404.jpeg"),
  path.join(FRONTEND_PUBLIC, "404.jpg"),
  path.join(BACKEND_PUBLIC,  "404.jpeg"),
  path.join(BACKEND_PUBLIC,  "404.jpg"),
];
console.log(
  "[STATIC] 404 image exists?",
  candidate404s.find(p => fs.existsSync(p)) || "NENHUM 404.(jpeg|jpg) ENCONTRADO"
);

// Rotas de autenticação montadas em /api/auth
app.use("/api/auth", authRoutes);

// Rotas de produtos montadas em /api
app.use("/api", produtosRoutes);

app.use((req, res) => {
  res.status(404).type("html").send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 - Página não encontrada</title>
        <style>
          :root {
            --bg: #5a5a5a;
            --fg: #ffffff;
          }
          * { box-sizing: border-box; }
          html, body { height: 100%; margin: 0; }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--bg);
            color: var(--fg);
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            text-align: center;
          }
          .container { padding: 24px; }
          .container img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 16px auto 0;
          }
          h1 { font-size: 64px; margin: 0 0 8px; }
          h2 { font-weight: 400; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <h2>Página não encontrada</h2>
        </div>
      </body>
    </html>
  `);
});

export default app;
