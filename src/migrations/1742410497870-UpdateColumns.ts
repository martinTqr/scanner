import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumns1742410497870 implements MigrationInterface {
    name = 'UpdateColumns1742410497870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`value\` \`value\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`detail\` \`detail\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`quantity\` \`quantity\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`amount\` \`amount\` float NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`amount\` \`amount\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`quantity\` \`quantity\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`detail\` \`detail\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`value\` \`value\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
    }

}
