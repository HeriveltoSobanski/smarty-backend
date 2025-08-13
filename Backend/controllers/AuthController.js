import Usuario from '../models/Usuario.js'

const AuthController = {
  login: async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' })
    }

    const usuario = await Usuario.findByEmail(email)

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' })
    }

    return res.status(200).json({ mensagem: 'Login realizado com sucesso' })
  }
}

export default AuthController
