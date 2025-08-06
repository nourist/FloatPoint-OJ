import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContestDescriptionColumn1754399041187 implements MigrationInterface {
	name = 'AddContestDescriptionColumn1754399041187';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests" ADD "description" text NOT NULL DEFAULT ''`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "description"`);
	}
}
