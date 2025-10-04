'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('123456', 10);
    await queryInterface.bulkInsert('usuarios', [{
      nome: 'Usuário Demo',
      email: 'demo@exemplo.com',
      senha: hash,
      tipo_usuario: 'cliente',
      documento: null,
      criado_em: new Date(),
      atualizado_em: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', { email: 'demo@exemplo.com' }, {});
  }
};
