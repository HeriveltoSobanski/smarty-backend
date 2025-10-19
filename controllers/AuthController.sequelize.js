import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

export const register = async (req, res) => {
  try {
    const { nome, email, cpf, telefone, senha } = req.body;

    if (!nome || !email || !cpf || !telefone || !senha) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // verifica se já existe um usuário com o mesmo e-mail
    const userExists = await Usuario.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // cria o novo usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      cpf,
      telefone,
      senha: hashedPassword,
      tipo_usuario: 1,
      ativo: true,
    });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: {
        id: novoUsuario.id_usuario,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
    });
  } catch (error) {
    console.error("Erro register:", error);
    res.status(500).json({ message: "Erro ao registrar usuário." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro login:", error);
    res.status(500).json({ message: "Erro ao realizar login." });
  }
};
  