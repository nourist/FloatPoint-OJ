import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditAuthUserColumns1754231251505 implements MigrationInterface {
	name = 'EditAuthUserColumns1754231251505';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verificationToken"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "verificationToken" uuid`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordToken"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordToken" uuid`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordToken"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordToken" character varying(255)`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verificationToken"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "verificationToken" character varying(255)`);
	}
}
