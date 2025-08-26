import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
const { Pool } = pkg;

console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Senha:", process.env.DB_PASSWORD);
console.log("Banco:", process.env.DB_NAME);

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

db.connect()
  .then(() => console.log("Conexão com PostgreSQL estabelecida com sucesso."))
  .catch((err) => {
    console.error("Erro ao conectar ao PostgreSQL:", err);
    process.exit(1);
  });

export default db;