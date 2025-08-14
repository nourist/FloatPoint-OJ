import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditSubmissionNContestColumns1755145771391 implements MigrationInterface {
	name = 'EditSubmissionNContestColumns1755145771391';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "submission_results" ADD "slug" character varying NOT NULL`);
		await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "totalScore"`);
		await queryRunner.query(`ALTER TABLE "submissions" ADD "totalScore" numeric(11,2) NOT NULL DEFAULT '0'`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "totalScore"`);
		await queryRunner.query(`ALTER TABLE "submissions" ADD "totalScore" integer NOT NULL DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "submission_results" DROP COLUMN "slug"`);
	}
}
