import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1743006856584 implements MigrationInterface {
    name = 'FirstMigration1743006856584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`document_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`confidence\` float NULL, \`file_name\` varchar(255) NOT NULL, \`batch\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL DEFAULT '', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, UNIQUE INDEX \`REL_6b33c99afacd167cb59723756b\` (\`document_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL DEFAULT '', \`detail\` varchar(255) NOT NULL DEFAULT '', \`quantity\` float NOT NULL DEFAULT '0', \`amount\` float NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`provider_name\` varchar(255) NULL, \`provider_cuit\` varchar(255) NULL, \`code\` varchar(255) NULL, \`date\` datetime NULL, \`expiration_date\` datetime NULL, \`description\` varchar(255) NULL, \`receiptType\` enum ('A', 'B', 'C', 'E', 'M') NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, UNIQUE INDEX \`REL_78f5e16f1322a7b2b150364ddd\` (\`document_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_tax\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`value\` float NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`document_details\` ADD CONSTRAINT \`FK_6b33c99afacd167cb59723756b9\` FOREIGN KEY (\`document_id\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document_item\` ADD CONSTRAINT \`FK_e4adb85d5c78d5ca9ff334fb07b\` FOREIGN KEY (\`document_id\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_78f5e16f1322a7b2b150364dddc\` FOREIGN KEY (\`document_id\`) REFERENCES \`document_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` ADD CONSTRAINT \`FK_fd10939c482004859751de447bf\` FOREIGN KEY (\`document_id\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_tax\` DROP FOREIGN KEY \`FK_fd10939c482004859751de447bf\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_78f5e16f1322a7b2b150364dddc\``);
        await queryRunner.query(`ALTER TABLE \`document_item\` DROP FOREIGN KEY \`FK_e4adb85d5c78d5ca9ff334fb07b\``);
        await queryRunner.query(`ALTER TABLE \`document_details\` DROP FOREIGN KEY \`FK_6b33c99afacd167cb59723756b9\``);
        await queryRunner.query(`DROP TABLE \`document_tax\``);
        await queryRunner.query(`DROP INDEX \`REL_78f5e16f1322a7b2b150364ddd\` ON \`document\``);
        await queryRunner.query(`DROP TABLE \`document\``);
        await queryRunner.query(`DROP TABLE \`document_item\``);
        await queryRunner.query(`DROP INDEX \`REL_6b33c99afacd167cb59723756b\` ON \`document_details\``);
        await queryRunner.query(`DROP TABLE \`document_details\``);
    }

}
