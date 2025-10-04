import express from "express";
import db from "../config/db.js";

const router = express.Router();

// CREATE - POST /api/produtos
router.post("/produtos", async (req, res) => {
  try {
    const { id_empresa, id_categoria, nome, descricao, preco, ativo } = req.body;

    const { rows } = await db.query(
      `INSERT INTO produtos (id_empresa, id_categoria, nome, descricao, preco, ativo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id_empresa, id_categoria, nome, descricao, preco, ativo]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao criar produto", detalhe: err.message });
  }
});

// READ - GET /api/produtos (JSON)
router.get("/produtos", async (_req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM vw_produtos WHERE ativo = true"
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar produtos", detalhe: err.message });
  }
});

// READ - GET /api/produtos/html (HTML estilizado)
router.get("/produtos/html", async (_req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM vw_produtos WHERE ativo = true"
    );
    let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>vw_produtos</title>
    <style>body{font-family:Arial;margin:20px;background:#f4f4f4}h1{text-align:center}
    table{width:100%;border-collapse:collapse;background:#fff;margin-top:20px}
    th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#333;color:#fff}
    tr:nth-child(even){background:#f9f9f9}</style></head><body><h1>vw_produtos</h1><table><tr>
    <th>id_produto</th><th>id_empresa</th><th>empresa_nome</th><th>id_categoria</th><th>categoria_nome</th>
    <th>produto_nome</th><th>descricao</th><th>preco</th><th>ativo</th><th>criado_em</th><th>atualizado_em</th></tr>`;
    for (const p of rows) {
      html += `<tr><td>${p.id_produto}</td><td>${p.id_empresa}</td><td>${p.empresa_nome}</td>
      <td>${p.id_categoria}</td><td>${p.categoria_nome}</td><td>${p.produto_nome}</td>
      <td>${p.descricao}</td><td>R$ ${p.preco}</td><td>${p.ativo ? "Sim" : "Não"}</td>
      <td>${p.criado_em ? new Date(p.criado_em).toLocaleString() : ""}</td>
      <td>${p.atualizado_em ? new Date(p.atualizado_em).toLocaleString() : ""}</td></tr>`;
    }
    html += `</table></body></html>`;
    res.send(html);
  } catch (err) {
    res
      .status(500)
      .send(`<h1>Erro ao buscar vw_produtos</h1><p>${err.message}</p>`);
  }
});

// UPDATE - PUT /api/produtos/:id
router.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, ativo } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE produtos
       SET nome=$1, descricao=$2, preco=$3, ativo=$4, atualizado_em=NOW()
       WHERE id_produto=$5
       RETURNING *`,
      [nome, descricao, preco, ativo, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar produto", detalhe: err.message });
  }
});

// DELETE - DELETE /api/produtos/:id
router.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM produtos WHERE id_produto=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json({
      mensagem: "Produto deletado com sucesso",
      produto: result.rows[0],
    });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao deletar produto", detalhe: err.message });
  }
});

export default router;
