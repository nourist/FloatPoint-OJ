import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBlogCommentRelation1755841626468 implements MigrationInterface {
    name = 'FixBlogCommentRelation1755841626468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c5841a0dd900a8e78146810d909"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"new_blog":true,"new_problem":true,"new_contest":true,"update_rating":true,"system":true}'`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c5841a0dd900a8e78146810d909" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c5841a0dd900a8e78146810d909"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "notificationSettings" SET DEFAULT '{"system": true, "new_blog": true, "new_contest": true, "new_problem": true, "update_rating": true}'`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c5841a0dd900a8e78146810d909" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
