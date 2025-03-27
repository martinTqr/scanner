import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1743099970130 implements MigrationInterface {
    name = 'UpdateEntity1743099970130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`detail\` \`description\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`description\` \`observations\` varchar(1000) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`description\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD \`description\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`observations\` \`description\` varchar(1000) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`description\` \`detail\` varchar(255) NOT NULL DEFAULT ''`);
    }

}
