const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config(); // Carrega variáveis de ambiente do .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Smarty120706",
  database: process.env.DB_NAME || "smartydb",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar com o banco:", err);
  } else {
    console.log("Conectado ao banco de dados com sucesso!");
  }
});

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;
  const sql = "INSERT INTO usuarios (nome, email) VALUES (?, ?)";
  db.query(sql, [nome, email], (err, result) => {
    if (err) {
      console.error("Erro ao inserir usuário:", err);
      return res.status(500).json({ error: "Erro ao inserir usuário" });
    }
    res.status(201).json({ message: "Usuário cadastrado com sucesso!", id: result.insertId });
  });
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  if (email === "admin@teste.com" && senha === "123") {
    res.json({ mensagem: "Login efetuado", token: "fake-token" });
  } else {
    res.status(401).json({ erro: "Credenciais inválidas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
app.use((req, res) => {
  res.status(404).json({
    erro: true,
    mensagem: 'Rota não encontrada.',
  });
});
