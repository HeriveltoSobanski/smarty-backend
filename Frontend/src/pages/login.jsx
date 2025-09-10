import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || '' })

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/api/auth/login', { email, senha })
      alert('Login ok')
      console.log(data)
    } catch (e) {
      alert('Falha no login')
      console.error(e)
    }
  }

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
      <input value={senha} onChange={e => setSenha(e.target.value)} placeholder="senha" type="password" />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  )
}
