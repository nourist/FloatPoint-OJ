import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditSubmissionNNotificationTables1754409319026 implements MigrationInterface {
	name = 'EditSubmissionNNotificationTables1754409319026';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_a659ade908bd365bf760853fd4f"`);
		await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "content" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "isRead" SET DEFAULT false`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(
			`ALTER TABLE "submissions" ADD CONSTRAINT "FK_a659ade908bd365bf760853fd4f" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_a659ade908bd365bf760853fd4f"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "isRead" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "content" SET NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "submissions" ADD CONSTRAINT "FK_a659ade908bd365bf760853fd4f" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}
}
