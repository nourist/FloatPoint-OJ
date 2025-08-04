import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseUserPasswordAsOptional1754284142105 implements MigrationInterface {
	name = 'UseUserPasswordAsOptional1754284142105';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
	}
}
