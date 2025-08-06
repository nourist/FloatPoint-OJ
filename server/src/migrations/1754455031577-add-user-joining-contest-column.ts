import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserJoiningContestColumn1754455031577 implements MigrationInterface {
	name = 'AddUserJoiningContestColumn1754455031577';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ADD "joiningContestId" uuid`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "FK_2862b6d7b4fcb659f3cb2265cf3" FOREIGN KEY ("joiningContestId") REFERENCES "contests"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_2862b6d7b4fcb659f3cb2265cf3"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "joiningContestId"`);
	}
}
