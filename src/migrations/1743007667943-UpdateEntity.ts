import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1743007667943 implements MigrationInterface {
    name = 'UpdateEntity1743007667943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`documentType\` enum ('FACTURA', 'NOTA CREDITO', 'NOTA DEBITO', 'RECIBO', 'COMPROBANTE COMPRA') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`documentType\``);
    }

}
