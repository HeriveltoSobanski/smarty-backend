import sequelize from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { nome, email, telefone, senha, tipo_usuario, cpf, cnpj } = req.body;

  if (!nome || !email || !senha || !tipo_usuario)
    return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios." });

  try {
    const [resultado] = await sequelize.query(
      "SELECT 1 FROM usuarios WHERE email = :email",
      { replacements: { email } }
    );

    if (resultado.length > 0)
      return res.status(409).json({ mensagem: "E-mail já cadastrado." });

    const hash = await bcrypt.hash(senha, 10);

    const [novoUsuario] = await sequelize.query(
      `INSERT INTO usuarios 
        (nome, email, telefone, senha, tipo_usuario, cpf, cnpj, criado_em, atualizado_em)
       VALUES (:nome, :email, :telefone, :senha, :tipo_usuario, :cpf, :cnpj, NOW(), NOW())
       RETURNING id_usuario, nome, email, tipo_usuario`,
      {
        replacements: { nome, email, telefone, senha: hash, tipo_usuario, cpf, cnpj },
      }
    );

    const user = novoUsuario[0];

    const token = jwt.sign({ sub: user.id_usuario }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    });

    return res.status(201).json({ usuario: user, token });
  } catch (err) {
    console.error("Erro register:", err);
    return res.status(500).json({ mensagem: "Erro no servidor", detalhe: err.message });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });

  try {
    const [resultado] = await sequelize.query(
      "SELECT * FROM usuarios WHERE email = :email",
      { replacements: { email } }
    );

    if (resultado.length === 0)
      return res.status(404).json({ mensagem: "Usuário não encontrado." });

    const usuario = resultado[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida)
      return res.status(401).json({ mensagem: "Senha incorreta." });

    const token = jwt.sign({ sub: usuario.id_usuario }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    });

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      token,
    });
  } catch (err) {
    console.error("Erro login:", err);
    return res.status(500).json({ mensagem: "Erro no servidor", detalhe: err.message });
  }
};
