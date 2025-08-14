import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditContestColumns1755142114218 implements MigrationInterface {
	name = 'EditContestColumns1755142114218';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "type"`);
		await queryRunner.query(`DROP TYPE "public"."contests_type_enum"`);
		await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "rated"`);
		await queryRunner.query(`ALTER TABLE "contests" ADD "isRatingUpdated" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`ALTER TABLE "contests" ADD "isRated" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`ALTER TABLE "contests" ADD "penalty" integer NOT NULL DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_0537bd4bb79cd083506687ed311"`);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_b97e3e5a3a5543cabb8bb35e0fb" UNIQUE ("slug")`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_0537bd4bb79cd083506687ed311" UNIQUE ("problemId", "slug")`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_0537bd4bb79cd083506687ed311"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "UQ_b97e3e5a3a5543cabb8bb35e0fb"`);
		await queryRunner.query(`ALTER TABLE "subtasks" ADD CONSTRAINT "UQ_0537bd4bb79cd083506687ed311" UNIQUE ("problemId", "slug")`);
		await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "penalty"`);
		await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "isRated"`);
		await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "isRatingUpdated"`);
		await queryRunner.query(`ALTER TABLE "contests" ADD "rated" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`CREATE TYPE "public"."contests_type_enum" AS ENUM('ioi', 'icpc')`);
		await queryRunner.query(`ALTER TABLE "contests" ADD "type" "public"."contests_type_enum" NOT NULL`);
	}
}
