import db from '../sequelize/models/index.cjs'
const { Usuario } = db

export const listar = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ['id_usuario', 'nome', 'email', 'tipo_usuario', 'documento', 'criado_em', 'atualizado_em'] })
    res.json(usuarios)
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar usuários', detalhe: err.message })
  }
}

export const obter = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const usuario = await Usuario.findByPk(id, { attributes: ['id_usuario', 'nome', 'email', 'tipo_usuario', 'documento', 'criado_em', 'atualizado_em'] })
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    res.json(usuario)
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao obter usuário', detalhe: err.message })
  }
}

export const criar = async (req, res) => {
  const { nome, email, senha, tipo_usuario, documento } = req.body
  if (!nome || !email || !senha) return res.status(400).json({ mensagem: 'nome, email e senha são obrigatórios' })
  try {
    const usuario = await Usuario.create({ nome, email, senha, tipo_usuario, documento })
    res.status(201).json(usuario)
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar usuário', detalhe: err.message })
  }
}

export const atualizar = async (req, res) => {
  const id = Number(req.params.id)
  const { nome, email, tipo_usuario, documento } = req.body
  try {
    const [count] = await Usuario.update({ nome, email, tipo_usuario, documento }, { where: { id_usuario: id } })
    if (!count) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    const usuario = await Usuario.findByPk(id)
    res.json(usuario)
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário', detalhe: err.message })
  }
}

export const remover = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const count = await Usuario.destroy({ where: { id_usuario: id } })
    if (!count) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    res.json({ mensagem: 'Usuário removido' })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao remover usuário', detalhe: err.message })
  }
}
