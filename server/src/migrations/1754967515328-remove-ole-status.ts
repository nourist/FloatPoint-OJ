import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOleStatus1754967515328 implements MigrationInterface {
	name = 'RemoveOleStatus1754967515328';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TYPE "public"."submission_results_status_enum" RENAME TO "submission_results_status_enum_old"`);
		await queryRunner.query(
			`CREATE TYPE "public"."submission_results_status_enum" AS ENUM('ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED')`,
		);
		await queryRunner.query(
			`ALTER TABLE "submission_results" ALTER COLUMN "status" TYPE "public"."submission_results_status_enum" USING "status"::"text"::"public"."submission_results_status_enum"`,
		);
		await queryRunner.query(`DROP TYPE "public"."submission_results_status_enum_old"`);
		await queryRunner.query(`ALTER TYPE "public"."submissions_status_enum" RENAME TO "submissions_status_enum_old"`);
		await queryRunner.query(
			`CREATE TYPE "public"."submissions_status_enum" AS ENUM('PENDING', 'JUDGING', 'ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'INTERNAL_ERROR')`,
		);
		await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "status" DROP DEFAULT`);
		await queryRunner.query(
			`ALTER TABLE "submissions" ALTER COLUMN "status" TYPE "public"."submissions_status_enum" USING "status"::"text"::"public"."submissions_status_enum"`,
		);
		await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
		await queryRunner.query(`DROP TYPE "public"."submissions_status_enum_old"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."submissions_status_enum_old" AS ENUM('PENDING', 'JUDGING', 'ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'INTERNAL_ERROR')`,
		);
		await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "status" DROP DEFAULT`);
		await queryRunner.query(
			`ALTER TABLE "submissions" ALTER COLUMN "status" TYPE "public"."submissions_status_enum_old" USING "status"::"text"::"public"."submissions_status_enum_old"`,
		);
		await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
		await queryRunner.query(`DROP TYPE "public"."submissions_status_enum"`);
		await queryRunner.query(`ALTER TYPE "public"."submissions_status_enum_old" RENAME TO "submissions_status_enum"`);
		await queryRunner.query(
			`CREATE TYPE "public"."submission_results_status_enum_old" AS ENUM('ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED')`,
		);
		await queryRunner.query(
			`ALTER TABLE "submission_results" ALTER COLUMN "status" TYPE "public"."submission_results_status_enum_old" USING "status"::"text"::"public"."submission_results_status_enum_old"`,
		);
		await queryRunner.query(`DROP TYPE "public"."submission_results_status_enum"`);
		await queryRunner.query(`ALTER TYPE "public"."submission_results_status_enum_old" RENAME TO "submission_results_status_enum"`);
	}
}
