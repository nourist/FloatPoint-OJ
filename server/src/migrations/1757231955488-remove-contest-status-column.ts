import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveContestStatusColumn1757231955488 implements MigrationInterface {
    name = 'RemoveContestStatusColumn1757231955488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contests" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."contests_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contests_status_enum" AS ENUM('PENDING', 'RUNNING', 'ENDED')`);
        await queryRunner.query(`ALTER TABLE "contests" ADD "status" "public"."contests_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

}