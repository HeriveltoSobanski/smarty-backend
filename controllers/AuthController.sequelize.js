import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../sequelize/models/index.cjs'
const { Usuario } = db

export const register = async (req, res) => {
  const { nome, email, senha, tipo_usuario, documento } = req.body
  if (!nome || !email || !senha) return res.status(400).json({ mensagem: 'nome, email e senha são obrigatórios' })

  try {
    const existe = await Usuario.findOne({ where: { email } })
    if (existe) return res.status(409).json({ mensagem: 'E-mail já cadastrado' })

    const hash = await bcrypt.hash(senha, 10)
    const usuario = await Usuario.create({ nome, email, senha: hash, tipo_usuario, documento })
    const token = jwt.sign({ sub: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' })
    return res.status(201).json({
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        documento: usuario.documento,
        criado_em: usuario.criado_em
      },
      token
    })
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro no servidor', detalhe: err.message })
  }
}

export const login = async (req, res) => {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' })

  try {
    const user = await Usuario.findOne({ where: { email } })
    if (!user) return res.status(401).json({ mensagem: 'Credenciais inválidas' })

    const ok = await bcrypt.compare(senha, user.senha)
    if (!ok) return res.status(401).json({ mensagem: 'Credenciais inválidas' })

    const token = jwt.sign({ sub: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' })
    return res.json({ token })
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro no servidor', detalhe: err.message })
  }
}
