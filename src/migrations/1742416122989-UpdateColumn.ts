import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumn1742416122989 implements MigrationInterface {
    name = 'UpdateColumn1742416122989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`name\` \`name\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`detail\` \`detail\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`quantity\` \`quantity\` float NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`amount\` \`amount\` float NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`documentType\` \`documentType\` enum ('FACTURA', 'NOTA CREDITO', 'NOTA DEBITO', 'RECIBO', 'COMPROBANTE COMPRA') NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`receiptType\` \`receiptType\` enum ('A', 'B', 'C', 'E', 'M') NULL`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`value\` \`value\` float NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`value\` \`value\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`document_tax\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`receiptType\` \`receiptType\` enum ('A', 'B', 'C', 'E', 'M') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`documentType\` \`documentType\` enum ('FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO', 'RECIBO', 'COMPROBANTE_COMPRA') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`amount\` \`amount\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`quantity\` \`quantity\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`detail\` \`detail\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_item\` CHANGE \`name\` \`name\` varchar(255) NULL`);
    }

}
