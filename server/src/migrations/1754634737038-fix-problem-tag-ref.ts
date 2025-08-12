import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProblemTagRef1754634737038 implements MigrationInterface {
	name = 'FixProblemTagRef1754634737038';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "problem_tags_problems_problems" ("problemTagsId" uuid NOT NULL, "problemsId" uuid NOT NULL, CONSTRAINT "PK_206a7a94e0e192ece6cb2e615d7" PRIMARY KEY ("problemTagsId", "problemsId"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_6c9a6fc5796176cb3bdedbb3cc" ON "problem_tags_problems_problems" ("problemTagsId") `);
		await queryRunner.query(`CREATE INDEX "IDX_f92329bb3472d1203ab9e5f402" ON "problem_tags_problems_problems" ("problemsId") `);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(
			`ALTER TABLE "problem_tags_problems_problems" ADD CONSTRAINT "FK_6c9a6fc5796176cb3bdedbb3cc1" FOREIGN KEY ("problemTagsId") REFERENCES "problem_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "problem_tags_problems_problems" ADD CONSTRAINT "FK_f92329bb3472d1203ab9e5f4024" FOREIGN KEY ("problemsId") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "problem_tags_problems_problems" DROP CONSTRAINT "FK_f92329bb3472d1203ab9e5f4024"`);
		await queryRunner.query(`ALTER TABLE "problem_tags_problems_problems" DROP CONSTRAINT "FK_6c9a6fc5796176cb3bdedbb3cc1"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`DROP INDEX "public"."IDX_f92329bb3472d1203ab9e5f402"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_6c9a6fc5796176cb3bdedbb3cc"`);
		await queryRunner.query(`DROP TABLE "problem_tags_problems_problems"`);
	}
}
