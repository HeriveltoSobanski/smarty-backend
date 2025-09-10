import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  max: 10,
})

db.connect()
  .then(() => console.log('PostgreSQL conectado.'))
  .catch((err) => {
    console.error('Falha na conexão PostgreSQL:', err.message)
    process.exit(1)
  })

export default db
