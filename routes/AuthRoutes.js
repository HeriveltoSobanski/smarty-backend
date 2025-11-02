import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

function gerarCNPJFake() {
  const numeros = [];
  for (let i = 0; i < 14; i++) {
    numeros.push(Math.floor(Math.random() * 9));
  }
  return numeros.join("");
}

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuarios = await sequelize.query(
      "SELECT id_usuario, nome, email, senha, tipo_usuario, ativo FROM usuarios WHERE email = :email AND ativo = true LIMIT 1",
      { replacements: { email }, type: QueryTypes.SELECT }
    );

    if (!usuarios.length) return res.status(401).json({ message: "Usuário não encontrado" });

    const usuario = usuarios[0];
    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ sub: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login bem-sucedido",
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      token,
    });
  } catch (e) {
    console.error("Erro ao fazer login:", e);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.post("/register", async (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;

  try {
    const existentes = await sequelize.query(
      "SELECT 1 FROM usuarios WHERE email = :email LIMIT 1",
      { replacements: { email }, type: QueryTypes.SELECT }
    );

    if (existentes.length) return res.status(400).json({ message: "E-mail já cadastrado" });

    const hash = await bcrypt.hash(senha, 10);
    const isEmpresa = tipo_usuario === "empresa";
    const documento = isEmpresa ? gerarCNPJFake() : null;

    await sequelize.query(
      `INSERT INTO usuarios (nome, email, senha, tipo_usuario, documento, ativo, criado_em, atualizado_em)
       VALUES (:nome, :email, :senha, :tipo_usuario, :documento, true, NOW(), NOW())`,
      {
        replacements: {
          nome,
          email,
          senha: hash,
          tipo_usuario: tipo_usuario || "cliente",
          documento
        }
      }
    );

    console.log(`Usuário registrado: ${nome} (${email})`);
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (e) {
    console.error("Erro ao registrar usuário:", e);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const [usuario] = await sequelize.query(
      "SELECT id_usuario, nome, email, tipo_usuario FROM usuarios WHERE id_usuario = :id",
      { replacements: { id: req.user.id }, type: QueryTypes.SELECT }
    );

    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });

    res.json({ usuario });
  } catch (e) {
    console.error("Erro ao buscar usuário:", e);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

export default router;
