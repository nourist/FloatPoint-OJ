import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRelations1754233692464 implements MigrationInterface {
	name = 'FixRelations1754233692464';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_problems_problems" DROP CONSTRAINT "FK_af7c5ca74a8b6449996cf4ac1be"`);
		await queryRunner.query(
			`ALTER TABLE "contests_problems_problems" ADD CONSTRAINT "FK_af7c5ca74a8b6449996cf4ac1be" FOREIGN KEY ("problemsId") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_problems_problems" DROP CONSTRAINT "FK_af7c5ca74a8b6449996cf4ac1be"`);
		await queryRunner.query(
			`ALTER TABLE "contests_problems_problems" ADD CONSTRAINT "FK_af7c5ca74a8b6449996cf4ac1be" FOREIGN KEY ("problemsId") REFERENCES "problems"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}
}
