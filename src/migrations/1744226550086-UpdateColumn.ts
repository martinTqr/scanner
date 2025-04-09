import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumn1744226550086 implements MigrationInterface {
    name = 'UpdateColumn1744226550086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`value\` \`value\` float NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`value\` \`value\` float NOT NULL`);
    }

}
