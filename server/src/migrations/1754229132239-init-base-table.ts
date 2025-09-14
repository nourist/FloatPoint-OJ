import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitBaseTable1754229132239 implements MigrationInterface {
	name = 'InitBaseTable1754229132239';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TYPE "public"."contests_type_enum" AS ENUM('ioi', 'icpc')`);
		await queryRunner.query(
			`CREATE TABLE "contests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, "type" "public"."contests_type_enum" NOT NULL, "rated" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "creatorId" uuid, CONSTRAINT "UQ_9d34d0f5b13c895c8038b97e5b2" UNIQUE ("slug"), CONSTRAINT "PK_0b8012f5cf6f444a52179e1227a" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."submission_results_status_enum" AS ENUM('ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED')`,
		);
		await queryRunner.query(
			`CREATE TABLE "submission_results" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."submission_results_status_enum" NOT NULL, "executionTime" integer NOT NULL, "memoryUsed" integer NOT NULL, "submissionId" uuid, CONSTRAINT "PK_dec944ea5d69b6178732a6db2ee" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."submissions_language_enum" AS ENUM('C99', 'C11', 'C17', 'C23', 'CPP03', 'CPP11', 'CPP14', 'CPP17', 'CPP20', 'CPP23', 'JAVA_8', 'JAVA_11', 'JAVA_17', 'PYTHON2', 'PYTHON3')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."submissions_status_enum" AS ENUM('PENDING', 'JUDGING', 'ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'INTERNAL_ERROR')`,
		);
		await queryRunner.query(
			`CREATE TABLE "submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sourceCode" text NOT NULL, "language" "public"."submissions_language_enum" NOT NULL, "status" "public"."submissions_status_enum" NOT NULL DEFAULT 'PENDING', "totalScore" integer NOT NULL DEFAULT '0', "submittedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "log" text NOT NULL DEFAULT '', "authorId" uuid, "problemId" uuid, "contestId" uuid, CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problem_editorials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "creatorId" uuid, "problemId" uuid, CONSTRAINT "PK_c64f8a862c6cda6ac62e2180b67" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL, "fullname" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "rating" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "problem_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_0399bff90bd3ebbaf18a96bc106" UNIQUE ("name"), CONSTRAINT "PK_efbb187993b145e50ef85cda97d" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(`CREATE TYPE "public"."problems_iomode_enum" AS ENUM('standard', 'file')`);
		await queryRunner.query(`CREATE TYPE "public"."problems_scoringmethod_enum" AS ENUM('standard', 'subtask', 'icpc')`);
		await queryRunner.query(`CREATE TYPE "public"."problems_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
		await queryRunner.query(
			`CREATE TABLE "problems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "statement" text NOT NULL DEFAULT '', "timeLimit" integer NOT NULL DEFAULT '1000', "memoryLimit" integer NOT NULL DEFAULT '128', "point" integer NOT NULL DEFAULT '100', "ioMode" "public"."problems_iomode_enum" NOT NULL DEFAULT 'standard', "inputFile" character varying, "outputFile" character varying, "scoringMethod" "public"."problems_scoringmethod_enum" NOT NULL DEFAULT 'standard', "difficulty" "public"."problems_difficulty_enum" NOT NULL DEFAULT 'medium', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "creatorId" uuid, CONSTRAINT "UQ_ed0948d10a4b9dff13c9461090b" UNIQUE ("slug"), CONSTRAINT "PK_b3994afba6ab64a42cda1ccaeff" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "subtasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "problemId" uuid, CONSTRAINT "UQ_b97e3e5a3a5543cabb8bb35e0fb" UNIQUE ("slug"), CONSTRAINT "PK_035c1c153f0239ecc95be448d96" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "test_cases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "subtaskId" uuid, CONSTRAINT "UQ_91fcad09ec9ac9c9ec6276fe50f" UNIQUE ("subtaskId", "slug"), CONSTRAINT "PK_39eb2dc90c54d7a036b015f05c4" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "contests_problems_problems" ("contestsId" uuid NOT NULL, "problemsId" uuid NOT NULL, CONSTRAINT "PK_bc7b2245b9563023874a6bb05ce" PRIMARY KEY ("contestsId", "problemsId"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_f9b17254908e1a9ccdf3f0117b" ON "contests_problems_problems" ("contestsId") `);
		await queryRunner.query(`CREATE INDEX "IDX_af7c5ca74a8b6449996cf4ac1b" ON "contests_problems_problems" ("problemsId") `);
		await queryRunner.query(
			`CREATE TABLE "contests_participants_users" ("contestsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_b2a81823907a222dcea56175e8b" PRIMARY KEY ("contestsId", "usersId"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_a2d3fd26863eada4a93d7bacbe" ON "contests_participants_users" ("contestsId") `);
		await queryRunner.query(`CREATE INDEX "IDX_0ae6fdff1051c718f427d03367" ON "contests_participants_users" ("usersId") `);
		await queryRunner.query(
			`ALTER TABLE "contests" ADD CONSTRAINT "FK_0aa1119efa2dfffd78fa6c8607f" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "submission_results" ADD CONSTRAINT "FK_da77e708458210d234283f8ecc7" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "submissions" ADD CONSTRAINT "FK_f9feced9d5cfc8687349db97351" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "submissions" ADD CONSTRAINT "FK_a659ade908bd365bf760853fd4f" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "submissions" ADD CONSTRAINT "FK_924ace5f2c5085787fd441cbc32" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problem_editorials" ADD CONSTRAINT "FK_0185215391e7d0d4a4d1a47bcff" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problem_editorials" ADD CONSTRAINT "FK_2c0f8a749b137f74ab6bc05ad93" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "problems" ADD CONSTRAINT "FK_bb54380c87008260fcd4531b7ef" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "subtasks" ADD CONSTRAINT "FK_461b8fffef6a4a89f0e666c353e" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "test_cases" ADD CONSTRAINT "FK_b37a8aed9d23ad7a5103a6e48aa" FOREIGN KEY ("subtaskId") REFERENCES "subtasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_problems_problems" ADD CONSTRAINT "FK_f9b17254908e1a9ccdf3f0117bb" FOREIGN KEY ("contestsId") REFERENCES "contests"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_problems_problems" ADD CONSTRAINT "FK_af7c5ca74a8b6449996cf4ac1be" FOREIGN KEY ("problemsId") REFERENCES "problems"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_participants_users" ADD CONSTRAINT "FK_a2d3fd26863eada4a93d7bacbe9" FOREIGN KEY ("contestsId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "contests_participants_users" ADD CONSTRAINT "FK_0ae6fdff1051c718f427d03367c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contests_participants_users" DROP CONSTRAINT "FK_0ae6fdff1051c718f427d03367c"`);
		await queryRunner.query(`ALTER TABLE "contests_participants_users" DROP CONSTRAINT "FK_a2d3fd26863eada4a93d7bacbe9"`);
		await queryRunner.query(`ALTER TABLE "contests_problems_problems" DROP CONSTRAINT "FK_af7c5ca74a8b6449996cf4ac1be"`);
		await queryRunner.query(`ALTER TABLE "contests_problems_problems" DROP CONSTRAINT "FK_f9b17254908e1a9ccdf3f0117bb"`);
		await queryRunner.query(`ALTER TABLE "test_cases" DROP CONSTRAINT "FK_b37a8aed9d23ad7a5103a6e48aa"`);
		await queryRunner.query(`ALTER TABLE "subtasks" DROP CONSTRAINT "FK_461b8fffef6a4a89f0e666c353e"`);
		await queryRunner.query(`ALTER TABLE "problems" DROP CONSTRAINT "FK_bb54380c87008260fcd4531b7ef"`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP CONSTRAINT "FK_2c0f8a749b137f74ab6bc05ad93"`);
		await queryRunner.query(`ALTER TABLE "problem_editorials" DROP CONSTRAINT "FK_0185215391e7d0d4a4d1a47bcff"`);
		await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_924ace5f2c5085787fd441cbc32"`);
		await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_a659ade908bd365bf760853fd4f"`);
		await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_f9feced9d5cfc8687349db97351"`);
		await queryRunner.query(`ALTER TABLE "submission_results" DROP CONSTRAINT "FK_da77e708458210d234283f8ecc7"`);
		await queryRunner.query(`ALTER TABLE "contests" DROP CONSTRAINT "FK_0aa1119efa2dfffd78fa6c8607f"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_0ae6fdff1051c718f427d03367"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_a2d3fd26863eada4a93d7bacbe"`);
		await queryRunner.query(`DROP TABLE "contests_participants_users"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_af7c5ca74a8b6449996cf4ac1b"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_f9b17254908e1a9ccdf3f0117b"`);
		await queryRunner.query(`DROP TABLE "contests_problems_problems"`);
		await queryRunner.query(`DROP TABLE "test_cases"`);
		await queryRunner.query(`DROP TABLE "subtasks"`);
		await queryRunner.query(`DROP TABLE "problems"`);
		await queryRunner.query(`DROP TYPE "public"."problems_difficulty_enum"`);
		await queryRunner.query(`DROP TYPE "public"."problems_scoringmethod_enum"`);
		await queryRunner.query(`DROP TYPE "public"."problems_iomode_enum"`);
		await queryRunner.query(`DROP TABLE "problem_tags"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
		await queryRunner.query(`DROP TABLE "problem_editorials"`);
		await queryRunner.query(`DROP TABLE "submissions"`);
		await queryRunner.query(`DROP TYPE "public"."submissions_status_enum"`);
		await queryRunner.query(`DROP TYPE "public"."submissions_language_enum"`);
		await queryRunner.query(`DROP TABLE "submission_results"`);
		await queryRunner.query(`DROP TYPE "public"."submission_results_status_enum"`);
		await queryRunner.query(`DROP TABLE "contests"`);
		await queryRunner.query(`DROP TYPE "public"."contests_type_enum"`);
	}
}
