import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogNNotificationTables1754320978762 implements MigrationInterface {
	name = 'AddBlogNNotificationTables1754320978762';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_participants_users" DROP CONSTRAINT "FK_0ae6fdff1051c718f427d03367c"`);
		await queryRunner.query(
			`CREATE TABLE "blog_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "blogId" uuid, CONSTRAINT "PK_b478aaeecf38441a25739aa9610" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "thumbnailUrl" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('new_blog', 'new_problem', 'new_contest', 'update_rating', 'system')`);
		await queryRunner.query(
			`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "isRead" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "blogId" uuid, "problemId" uuid, "contestId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(`ALTER TABLE "users" ADD "bio" text NOT NULL DEFAULT ''`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "notificationSettings" jsonb NOT NULL DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rating"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "rating" integer array NOT NULL DEFAULT '{}'`);
		await queryRunner.query(
			`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_166954a3340789682daf335b3f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c5841a0dd900a8e78146810d909" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "blogs" ADD CONSTRAINT "FK_05aa4239904d894452e339e5139" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_78a78a9834bcc790f6d04c75bcc" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_3a422be16f2b2e65c21e18ea59b" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_a9f99fde20b2c12a6ae5fc543e4" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_participants_users" ADD CONSTRAINT "FK_0ae6fdff1051c718f427d03367c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_participants_users" DROP CONSTRAINT "FK_0ae6fdff1051c718f427d03367c"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_a9f99fde20b2c12a6ae5fc543e4"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_3a422be16f2b2e65c21e18ea59b"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_78a78a9834bcc790f6d04c75bcc"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
		await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_05aa4239904d894452e339e5139"`);
		await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c5841a0dd900a8e78146810d909"`);
		await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_166954a3340789682daf335b3f4"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rating"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "rating" integer NOT NULL DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "notificationSettings"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
		await queryRunner.query(`DROP TABLE "notifications"`);
		await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
		await queryRunner.query(`DROP TABLE "blogs"`);
		await queryRunner.query(`DROP TABLE "blog_comments"`);
		await queryRunner.query(
			`ALTER TABLE "contests_participants_users" ADD CONSTRAINT "FK_0ae6fdff1051c718f427d03367c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}
}
