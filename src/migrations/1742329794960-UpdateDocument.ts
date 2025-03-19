import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDocument1742329794960 implements MigrationInterface {
    name = 'UpdateDocument1742329794960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`document_tax\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`value\` float NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` ADD CONSTRAINT \`FK_fd10939c482004859751de447bf\` FOREIGN KEY (\`document_id\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_tax\` DROP FOREIGN KEY \`FK_fd10939c482004859751de447bf\``);
        await queryRunner.query(`DROP TABLE \`document_tax\``);
    }

}
