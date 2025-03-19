import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1742401972411 implements MigrationInterface {
    name = 'UpdateEntity1742401972411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`batch\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`file_name\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`user_id\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`file_name\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`batch\``);
    }

}
