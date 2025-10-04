// Backend/middlewares/auth.js
import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // você pode anexar info do usuário no req
    req.user = { id: payload.sub }
    return next()
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' })
  }
}
