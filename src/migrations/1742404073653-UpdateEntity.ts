import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1742404073653 implements MigrationInterface {
    name = 'UpdateEntity1742404073653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`documentType\` enum ('FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO', 'RECIBO', 'COMPROBANTE_COMPRA') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`receiptType\` enum ('A', 'B', 'C', 'E', 'M') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`receiptType\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`documentType\``);
    }

}
