import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1743015267953 implements MigrationInterface {
    name = 'UpdateEntity1743015267953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`description\` varchar(1000) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`description\` varchar(255) NULL`);
    }

}
