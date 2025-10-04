import db from "../config/db.js";

const Usuario = {
  findByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM usuarios WHERE email = ?";
      db.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  create: async (nome, email, senha) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
      db.query(sql, [nome, email, senha], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }
};

export default Usuario;