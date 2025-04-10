import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1744292970023 implements MigrationInterface {
    name = 'FirstMigration1744292970023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`scann_confidence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entity\` enum ('Document', 'DocumentItem', 'DocumentTax') NULL, \`field\` varchar(255) NOT NULL, \`score\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`confidence\` int NULL, \`file_name\` varchar(255) NOT NULL, \`batch\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL DEFAULT '', \`document_id\` int NULL, UNIQUE INDEX \`REL_6b33c99afacd167cb59723756b\` (\`document_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL DEFAULT '', \`remito\` varchar(255) NOT NULL DEFAULT '', \`order\` varchar(255) NOT NULL DEFAULT '', \`name\` varchar(255) NOT NULL DEFAULT '', \`description\` varchar(255) NOT NULL DEFAULT '', \`dimensions\` varchar(255) NOT NULL DEFAULT '', \`unit\` varchar(255) NOT NULL DEFAULT '', \`quantity\` decimal(10,2) NOT NULL DEFAULT '0.00', \`unit_price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`bonus_1\` varchar(255) NOT NULL DEFAULT '', \`bonus_2\` varchar(255) NOT NULL DEFAULT '', \`bonus_3\` varchar(255) NOT NULL DEFAULT '', \`bonus_4\` varchar(255) NOT NULL DEFAULT '', \`weight\` varchar(255) NULL, \`length\` varchar(255) NULL, \`thickness\` varchar(255) NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`provider_name\` varchar(255) NULL, \`provider_cuit\` varchar(255) NULL, \`code\` varchar(255) NULL, \`date\` datetime NULL, \`expiration_date\` datetime NULL, \`observations\` varchar(1000) NULL, \`document_type\` enum ('FACTURA', 'NOTA CREDITO', 'NOTA DEBITO', 'RECIBO', 'COMPROBANTE COMPRA') NULL, \`receipt_type\` enum ('A', 'B', 'C', 'E', 'M') NULL, \`sell_condition\` varchar(255) NULL, \`cae_number\` bigint NOT NULL, \`cae_expiration_date\` datetime NULL, \`currency\` varchar(255) NULL, \`total\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, UNIQUE INDEX \`REL_78f5e16f1322a7b2b150364ddd\` (\`document_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_tax\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL DEFAULT '', \`value\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`document_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
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
        await queryRunner.query(`DROP TABLE \`scann_confidence\``);
    }

}
