import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1743104434311 implements MigrationInterface {
    name = 'UpdateEntity1743104434311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`scann_confidence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entity\` enum ('document', 'document_item', 'document_tax') NULL, \`field\` varchar(255) NOT NULL, \`score\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`scann_confidence\``);
    }

}
