import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProblemEditoralRef1754634404544 implements MigrationInterface {
	name = 'FixProblemEditoralRef1754634404544';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP CONSTRAINT "FK_2c0f8a749b137f74ab6bc05ad93"`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" ADD CONSTRAINT "UQ_2c0f8a749b137f74ab6bc05ad93" UNIQUE ("problemId")`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(
			`ALTER TABLE "problem_editorials" ADD CONSTRAINT "FK_2c0f8a749b137f74ab6bc05ad93" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP CONSTRAINT "FK_2c0f8a749b137f74ab6bc05ad93"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP CONSTRAINT "UQ_2c0f8a749b137f74ab6bc05ad93"`);
		await queryRunner.query(
			`ALTER TABLE "problem_editorials" ADD CONSTRAINT "FK_2c0f8a749b137f74ab6bc05ad93" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}
}
