import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSubtaskSlug1754974563719 implements MigrationInterface {
	name = 'FixSubtaskSlug1754974563719';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "memoryLimit" SET DEFAULT '131072'`);

		await queryRunner.query(`
			DELETE FROM subtasks a
			USING subtasks b
			WHERE a.ctid < b.ctid
			  AND a."problemId" = b."problemId"
			  AND a.slug = b.slug
		`);

		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_b97e3e5a3a5543cabb8bb35e0fb"`);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_0537bd4bb79cd083506687ed311" UNIQUE ("problemId", "slug")`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_0537bd4bb79cd083506687ed311"`);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_b97e3e5a3a5543cabb8bb35e0fb" UNIQUE ("slug")`);

		await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "memoryLimit" SET DEFAULT '128'`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
	}
}
