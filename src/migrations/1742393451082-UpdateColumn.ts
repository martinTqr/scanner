import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumn1742393451082 implements MigrationInterface {
    name = 'UpdateColumn1742393451082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`quantity\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`amount\` float NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`amount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`quantity\` int NOT NULL`);
    }

}
