import db from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const { nome, email, senha, tipo_usuario, documento } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'nome, email e senha são obrigatórios' })
  }

  try {
    // 1) existe e-mail?
    const { rows: jaExiste } = await db.query(
      'SELECT 1 FROM usuarios WHERE email = $1',
      [email]
    )
    if (jaExiste.length) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado' })
    }

    // 2) hashear senha
    const hash = await bcrypt.hash(senha, 10)

    // 3) inserir usuário
    const { rows } = await db.query(
      `INSERT INTO usuarios (nome, email, senha, tipo_usuario, documento, criado_em, atualizado_em)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id_usuario, nome, email, tipo_usuario, documento, criado_em`,
      [nome, email, hash, tipo_usuario || null, documento || null]
    )

    const user = rows[0]

    // 4) (opcional) já devolver JWT
    const token = jwt.sign({ sub: user.id_usuario }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '1d'
    })

    return res.status(201).json({ usuario: user, token })
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro no servidor', detalhe: err.message })
  }
}

export const login = async (req, res) => {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' })

  try {
    const { rows } = await db.query(
      'SELECT id_usuario, email, senha FROM usuarios WHERE email = $1',
      [email]
    )
    const user = rows[0]
    if (!user) return res.status(401).json({ mensagem: 'Credenciais inválidas' })

    const ok = await bcrypt.compare(senha, user.senha)
    if (!ok) return res.status(401).json({ mensagem: 'Credenciais inválidas' })

    const token = jwt.sign({ sub: user.id_usuario }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '1d'
    })
    return res.json({ token })
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro no servidor', detalhe: err.message })
  }
}
