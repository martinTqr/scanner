import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1743099389739 implements MigrationInterface {
    name = 'UpdateEntity1743099389739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_details\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`document_details\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`document_details\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`unitPrice\` float NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`bonus\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`bonus\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`unitPrice\``);
        await queryRunner.query(`ALTER TABLE \`document_details\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_details\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`document_details\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
