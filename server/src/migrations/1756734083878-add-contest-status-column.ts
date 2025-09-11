import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContestStatusColumn1756734083878 implements MigrationInterface {
	name = 'AddContestStatusColumn1756734083878';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TYPE "public"."contests_status_enum" AS ENUM('PENDING', 'RUNNING', 'ENDED')`);
		await queryRunner.query(`ALTER TABLE "contests" ADD "status" "public"."contests_status_enum" NOT NULL DEFAULT 'PENDING'`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "status"`);
		await queryRunner.query(`DROP TYPE "public"."contests_status_enum"`);
	}
}
