import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/produtos", async (req, res) => {
  const { id_empresa, id_categoria, nome, descricao, preco, ativo } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO produtos (id_empresa, id_categoria, nome, descricao, preco, ativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id_empresa, id_categoria, nome, descricao, preco, ativo]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar produto", detalhe: err.message });
  }
});

router.get("/produtos", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM produtos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
});

router.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, ativo } = req.body;
  try {
    await db.query(
      "UPDATE produtos SET nome = $1, descricao = $2, preco = $3, ativo = $4, atualizado_em = NOW() WHERE id_produto = $5",
      [nome, descricao, preco, ativo, id]
    );
    res.json({ mensagem: "Produto atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
});

router.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM produtos WHERE id_produto = $1", [id]);
    res.json({ mensagem: "Produto deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar produto" });
  }
});

export default router;