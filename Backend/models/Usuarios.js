const usuariosFake = [
  { id: 1, email: 'admin@teste.com', senha: '123456' }
]

const Usuario = {
  findByEmail: async (email) => {
    return usuariosFake.find((user) => user.email === email)
  }
}

export default Usuario
