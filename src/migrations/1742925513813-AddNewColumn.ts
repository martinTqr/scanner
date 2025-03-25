import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumn1742925513813 implements MigrationInterface {
    name = 'AddNewColumn1742925513813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`confidence\` float NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`confidence\``);
    }

}
