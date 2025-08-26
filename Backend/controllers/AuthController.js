import db from "../config/db.js";

const AuthController = {
  login: async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
    }

    try {
      const result = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      const usuario = result.rows[0];

      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Credenciais inválidas" });
      }

      return res.status(200).json({ mensagem: "Login realizado com sucesso" });
    } catch (err) {
      return res.status(500).json({ mensagem: "Erro no servidor", detalhe: err.message });
    }
  }
};

export default AuthController;