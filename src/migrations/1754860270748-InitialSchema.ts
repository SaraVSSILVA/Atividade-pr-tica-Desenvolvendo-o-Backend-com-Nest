import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1754860270748 implements MigrationInterface {
  name = 'InitialSchema1754860270748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`book\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`description\` text NULL, \`author\` varchar(100) NOT NULL, \`publisher\` varchar(100) NULL, \`year_published\` int NULL, \`status\` enum ('Tenho', 'Quero', 'Lendo', 'Lido') NOT NULL DEFAULT 'Quero', \`priority\` enum ('Alta', 'Média', 'Baixa') NOT NULL DEFAULT 'Baixa', \`genre_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`genre\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_dd8cd9e50dd049656e4be1f7e8\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`loans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`loanDate\` datetime NOT NULL, \`returnDate\` datetime NULL, \`cedenteId\` int NULL, \`tomadorId\` int NULL, \`livroId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book\` ADD CONSTRAINT \`FK_f316eed809f6f7617821012ad05\` FOREIGN KEY (\`genre_id\`) REFERENCES \`genre\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_f23bbeb6cb4a936b726ec8ab658\` FOREIGN KEY (\`cedenteId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_2efe6742061ead9dbcdd2cdba0c\` FOREIGN KEY (\`tomadorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_1afe5a311d1cf4509bb690dbe6e\` FOREIGN KEY (\`livroId\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_1afe5a311d1cf4509bb690dbe6e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_2efe6742061ead9dbcdd2cdba0c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_f23bbeb6cb4a936b726ec8ab658\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_f316eed809f6f7617821012ad05\``,
    );
    await queryRunner.query(`DROP TABLE \`loans\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_dd8cd9e50dd049656e4be1f7e8\` ON \`genre\``,
    );
    await queryRunner.query(`DROP TABLE \`genre\``);
    await queryRunner.query(`DROP TABLE \`book\``);
  }
}
