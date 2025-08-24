import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDbRelations1755996880396 implements MigrationInterface {
	name = 'FixDbRelations1755996880396';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "problem_editorials" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
		await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug")`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7"`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP COLUMN "updatedAt"`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP COLUMN "createdAt"`);
	}
}
