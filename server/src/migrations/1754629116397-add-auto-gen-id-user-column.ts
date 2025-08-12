import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAutoGenIdUserColumn1754629116397 implements MigrationInterface {
	name = 'AddAutoGenIdUserColumn1754629116397';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_f9feced9d5cfc8687349db97351"`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP CONSTRAINT "FK_0185215391e7d0d4a4d1a47bcff"`);
		await queryRunner.query(`ALTER TABLE "contests_participants_users" DROP CONSTRAINT "FK_0ae6fdff1051c718f427d03367c"`);
		await queryRunner.query(`ALTER TABLE "problems" DROP CONSTRAINT "FK_bb54380c87008260fcd4531b7ef"`);
		await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_166954a3340789682daf335b3f4"`);
		await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_05aa4239904d894452e339e5139"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
		await queryRunner.query(`ALTER TABLE "contests" DROP CONSTRAINT "FK_0aa1119efa2dfffd78fa6c8607f"`);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(
			`ALTER TABLE "blogs" ADD CONSTRAINT "FK_05aa4239904d894452e339e5139" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_166954a3340789682daf335b3f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problem_editorials" ADD CONSTRAINT "FK_0185215391e7d0d4a4d1a47bcff" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "submissions" ADD CONSTRAINT "FK_f9feced9d5cfc8687349db97351" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems" ADD CONSTRAINT "FK_bb54380c87008260fcd4531b7ef" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests" ADD CONSTRAINT "FK_0aa1119efa2dfffd78fa6c8607f" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_participants_users" ADD CONSTRAINT "FK_0ae6fdff1051c718f427d03367c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_participants_users" DROP CONSTRAINT "FK_0ae6fdff1051c718f427d03367c"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
		await queryRunner.query(`ALTER TABLE "contests" DROP CONSTRAINT "FK_0aa1119efa2dfffd78fa6c8607f"`);
		await queryRunner.query(`ALTER TABLE "problems" DROP CONSTRAINT "FK_bb54380c87008260fcd4531b7ef"`);
		await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_f9feced9d5cfc8687349db97351"`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP CONSTRAINT "FK_0185215391e7d0d4a4d1a47bcff"`);
		await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_166954a3340789682daf335b3f4"`);
		await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_05aa4239904d894452e339e5139"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`,
		);
		await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
		await queryRunner.query(
			`ALTER TABLE "contests" ADD CONSTRAINT "FK_0aa1119efa2dfffd78fa6c8607f" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "blogs" ADD CONSTRAINT "FK_05aa4239904d894452e339e5139" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_166954a3340789682daf335b3f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems" ADD CONSTRAINT "FK_bb54380c87008260fcd4531b7ef" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_participants_users" ADD CONSTRAINT "FK_0ae6fdff1051c718f427d03367c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problem_editorials" ADD CONSTRAINT "FK_0185215391e7d0d4a4d1a47bcff" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "submissions" ADD CONSTRAINT "FK_f9feced9d5cfc8687349db97351" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}
}
