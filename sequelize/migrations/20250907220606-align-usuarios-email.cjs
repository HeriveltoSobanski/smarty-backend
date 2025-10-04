'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Garantir coluna email (se não existir)
    await queryInterface.sequelize.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN IF NOT EXISTS "email" VARCHAR(255)
    `);

    // Se precisar ser NOT NULL, coloque um valor temporário e remova o default depois
    await queryInterface.sequelize.query(`
      UPDATE "usuarios" SET "email" = CONCAT('temp_', "id_usuario", '@local')
      WHERE "email" IS NULL;
    `);

    await queryInterface.changeColumn('usuarios', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Índice único em email (se não existir)
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'ux_usuarios_email'
        ) THEN
          CREATE UNIQUE INDEX "ux_usuarios_email" ON "usuarios" ("email");
        END IF;
      END
      $$;
    `);
  },

  async down (queryInterface, Sequelize) {
    // Se precisar, remova o índice e (opcional) a coluna
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "ux_usuarios_email";`);
    // Cuidado: só remova a coluna se for intencional
    // await queryInterface.removeColumn('usuarios', 'email');
  }
};
