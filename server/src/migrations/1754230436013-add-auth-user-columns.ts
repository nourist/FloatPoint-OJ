import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthUserColumns1754230436013 implements MigrationInterface {
	name = 'AddAuthUserColumns1754230436013';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(255) NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
		await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(255) NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
		await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
		await queryRunner.query(`ALTER TABLE "users" ADD "isVerified" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`ALTER TABLE "users" ADD "verificationToken" character varying(255)`);
		await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordToken" character varying(255)`);
		await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordExpiresAt" TIMESTAMP WITH TIME ZONE`);
		await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying(255)`);
		await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "inputFile"`);
		await queryRunner.query(`ALTER TABLE "problems" ADD "inputFile" character varying(255)`);
		await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "outputFile"`);
		await queryRunner.query(`ALTER TABLE "problems" ADD "outputFile" character varying(255)`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "outputFile"`);
		await queryRunner.query(`ALTER TABLE "problems" ADD "outputFile" character varying`);
		await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN "inputFile"`);
		await queryRunner.query(`ALTER TABLE "problems" ADD "inputFile" character varying`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordExpiresAt"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordToken"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verificationToken"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isVerified"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
	}
}
