import express from "express";
import db from "../config/db.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post("/login", AuthController.login);

router.post("/usuarios", async (req, res) => {
  const { nome, tipo_usuario, documento } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO usuarios (nome, tipo_usuario, documento, criado_em, atualizado_em) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
      [nome, tipo_usuario, documento]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar usuário", detalhe: err.message });
  }
});

router.get("/usuarios", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

router.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, tipo_usuario, documento } = req.body;
  try {
    await db.query(
      "UPDATE usuarios SET nome = $1, tipo_usuario = $2, documento = $3, atualizado_em = NOW() WHERE id_usuario = $4",
      [nome, tipo_usuario, documento, id]
    );
    res.json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
});

router.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM usuarios WHERE id_usuario = $1", [id]);
    res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
});

export default router;