/*
  Warnings:

  - You are about to drop the `News` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'TEACHER', 'REVIEWER', 'STUDENT');

-- DropForeignKey
ALTER TABLE "public"."News" DROP CONSTRAINT "News_user_id_fkey";

-- DropTable
DROP TABLE "public"."News";

-- DropTable
DROP TABLE "public"."Users";

-- CreateTable
CREATE TABLE "public"."department" (
    "department_id" SERIAL NOT NULL,
    "department_name" TEXT,

    CONSTRAINT "department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "public"."domain" (
    "domain_id" SERIAL NOT NULL,
    "domain_name" TEXT,

    CONSTRAINT "domain_pkey" PRIMARY KEY ("domain_id")
);

-- CreateTable
CREATE TABLE "public"."departmentdomain" (
    "department_id" SERIAL NOT NULL,
    "domain_id" INTEGER NOT NULL,

    CONSTRAINT "departmentdomain_pkey" PRIMARY KEY ("department_id","domain_id")
);

-- CreateTable
CREATE TABLE "public"."paper" (
    "paper_id" SERIAL NOT NULL,
    "title" TEXT,
    "abstract" TEXT,
    "status" TEXT,
    "team_id" INTEGER,
    "submitted_by" INTEGER,
    "domain_id" INTEGER,

    CONSTRAINT "paper_pkey" PRIMARY KEY ("paper_id")
);

-- CreateTable
CREATE TABLE "public"."pc_chairman" (
    "chairman_id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "pc_chairman_pkey" PRIMARY KEY ("chairman_id")
);

-- CreateTable
CREATE TABLE "public"."proposal" (
    "proposal_id" SERIAL NOT NULL,
    "title" TEXT,
    "abstract" TEXT,
    "status" TEXT,
    "team_id" INTEGER,
    "submitted_by" INTEGER,
    "domain_id" INTEGER,

    CONSTRAINT "proposal_pkey" PRIMARY KEY ("proposal_id")
);

-- CreateTable
CREATE TABLE "public"."review" (
    "review_id" SERIAL NOT NULL,
    "reviewer_id" INTEGER,
    "proposal_id" INTEGER,
    "paper_id" INTEGER,
    "comments" TEXT,
    "score" INTEGER,
    "decision" TEXT,

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "public"."reviewer" (
    "reviewer_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,

    CONSTRAINT "reviewer_pkey" PRIMARY KEY ("reviewer_id")
);

-- CreateTable
CREATE TABLE "public"."reviewerassignment" (
    "assignment_id" SERIAL NOT NULL,
    "reviewer_id" INTEGER,
    "proposal_id" INTEGER,
    "paper_id" INTEGER,
    "assigned_by" INTEGER,

    CONSTRAINT "reviewerassignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "public"."reviewerpreference" (
    "reviewer_id" INTEGER NOT NULL,
    "domain_id" INTEGER NOT NULL,

    CONSTRAINT "reviewerpreference_pkey" PRIMARY KEY ("reviewer_id","domain_id")
);

-- CreateTable
CREATE TABLE "public"."student" (
    "student_id" SERIAL NOT NULL,
    "roll_number" TEXT,
    "department_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "public"."teacher" (
    "teacher_id" SERIAL NOT NULL,
    "designation" TEXT,
    "department_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "public"."team" (
    "team_id" SERIAL NOT NULL,
    "team_name" TEXT,

    CONSTRAINT "team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "public"."teammember" (
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_in_team" TEXT,

    CONSTRAINT "teammember_pkey" PRIMARY KEY ("team_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "user_id" INTEGER NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."userdomain" (
    "user_id" INTEGER NOT NULL,
    "domain_id" INTEGER NOT NULL,

    CONSTRAINT "userdomain_pkey" PRIMARY KEY ("user_id","domain_id")
);

-- AddForeignKey
ALTER TABLE "public"."departmentdomain" ADD CONSTRAINT "departmentdomain_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departmentdomain" ADD CONSTRAINT "departmentdomain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paper" ADD CONSTRAINT "paper_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paper" ADD CONSTRAINT "paper_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paper" ADD CONSTRAINT "paper_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pc_chairman" ADD CONSTRAINT "pc_chairman_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal" ADD CONSTRAINT "proposal_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal" ADD CONSTRAINT "proposal_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal" ADD CONSTRAINT "proposal_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewer"("reviewer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposal"("proposal_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "public"."paper"("paper_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewer" ADD CONSTRAINT "reviewer_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewer"("reviewer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposal"("proposal_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "public"."paper"("paper_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "public"."pc_chairman"("chairman_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerpreference" ADD CONSTRAINT "reviewerpreference_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewer"("reviewer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerpreference" ADD CONSTRAINT "reviewerpreference_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher" ADD CONSTRAINT "teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher" ADD CONSTRAINT "teacher_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teammember" ADD CONSTRAINT "teammember_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teammember" ADD CONSTRAINT "teammember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userdomain" ADD CONSTRAINT "userdomain_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userdomain" ADD CONSTRAINT "userdomain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;
