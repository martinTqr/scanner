import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1743105295935 implements MigrationInterface {
    name = 'UpdateEntity1743105295935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`scann_confidence\` CHANGE \`entity\` \`entity\` enum ('Document', 'DocumentItem', 'DocumentTax') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`scann_confidence\` CHANGE \`entity\` \`entity\` enum ('document', 'document_item', 'document_tax') NULL`);
    }

}
