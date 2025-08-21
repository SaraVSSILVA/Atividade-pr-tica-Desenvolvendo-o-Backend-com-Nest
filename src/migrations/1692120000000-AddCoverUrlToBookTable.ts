import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverUrlToBookTable1692120000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE book ADD COLUMN cover_url TEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE book DROP COLUMN cover_url`);
  }
}
