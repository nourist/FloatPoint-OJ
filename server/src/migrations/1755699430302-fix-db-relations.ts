import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDbRelations1755699430302 implements MigrationInterface {
	name = 'FixDbRelations1755699430302';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_problems_problems" DROP CONSTRAINT "FK_f9b17254908e1a9ccdf3f0117bb"`);
		await queryRunner.query(
			`CREATE TABLE "problems_tags_problem_tags" ("problemsId" uuid NOT NULL, "problemTagsId" uuid NOT NULL, CONSTRAINT "PK_99a1146b12ac2149f471d4508e4" PRIMARY KEY ("problemsId", "problemTagsId"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_ce12c63126cfc36dceb78f6adb" ON "problems_tags_problem_tags" ("problemsId") `);
		await queryRunner.query(`CREATE INDEX "IDX_730035071c29be6a61e9289ea0" ON "problems_tags_problem_tags" ("problemTagsId") `);
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_0537bd4bb79cd083506687ed311"`);
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_b97e3e5a3a5543cabb8bb35e0fb"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_0537bd4bb79cd083506687ed311" UNIQUE ("problemId", "slug")`);
		await queryRunner.query(
			`ALTER TABLE "problems_tags_problem_tags" ADD CONSTRAINT "FK_ce12c63126cfc36dceb78f6adb1" FOREIGN KEY ("problemsId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems_tags_problem_tags" ADD CONSTRAINT "FK_730035071c29be6a61e9289ea0b" FOREIGN KEY ("problemTagsId") REFERENCES "problem_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_problems_problems" ADD CONSTRAINT "FK_f9b17254908e1a9ccdf3f0117bb" FOREIGN KEY ("contestsId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_problems_problems" DROP CONSTRAINT "FK_f9b17254908e1a9ccdf3f0117bb"`);
		await queryRunner.query(`ALTER TABLE "problems_tags_problem_tags" DROP CONSTRAINT "FK_730035071c29be6a61e9289ea0b"`);
		await queryRunner.query(`ALTER TABLE "problems_tags_problem_tags" DROP CONSTRAINT "FK_ce12c63126cfc36dceb78f6adb1"`);
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_0537bd4bb79cd083506687ed311"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_b97e3e5a3a5543cabb8bb35e0fb" UNIQUE ("slug")`);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_0537bd4bb79cd083506687ed311" UNIQUE ("slug", "problemId")`);
		await queryRunner.query(`DROP INDEX "public"."IDX_730035071c29be6a61e9289ea0"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_ce12c63126cfc36dceb78f6adb"`);
		await queryRunner.query(`DROP TABLE "problems_tags_problem_tags"`);
		await queryRunner.query(
			`ALTER TABLE "contests_problems_problems" ADD CONSTRAINT "FK_f9b17254908e1a9ccdf3f0117bb" FOREIGN KEY ("contestsId") REFERENCES "contests"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
		);
	}
}
