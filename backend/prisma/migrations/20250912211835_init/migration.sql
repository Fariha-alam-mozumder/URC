-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'TEACHER', 'REVIEWER', 'STUDENT', 'GENERALUSER');

-- CreateEnum
CREATE TYPE "public"."TeamStatus" AS ENUM ('ACTIVE', 'RECRUITING', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."TeamVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."TeamRole" AS ENUM ('LEAD', 'RESEARCHER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "public"."PaperStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "public"."ReviewerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."AssignmentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

-- CreateTable
CREATE TABLE "public"."user" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "profile_image" TEXT,
    "role" "public"."Role",
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isMainAdmin" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."admin" (
    "admin_id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

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
    "department_id" INTEGER NOT NULL,
    "domain_id" INTEGER NOT NULL,

    CONSTRAINT "departmentdomain_pkey" PRIMARY KEY ("department_id","domain_id")
);

-- CreateTable
CREATE TABLE "public"."generaluser" (
    "generaluser_id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "generaluser_pkey" PRIMARY KEY ("generaluser_id")
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
    "isReviewer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "public"."reviewer" (
    "reviewer_id" SERIAL NOT NULL,
    "teacher_id" INTEGER,
    "status" "public"."ReviewerStatus" DEFAULT 'ACTIVE',

    CONSTRAINT "reviewer_pkey" PRIMARY KEY ("reviewer_id")
);

-- CreateTable
CREATE TABLE "public"."team" (
    "team_id" SERIAL NOT NULL,
    "team_name" TEXT,
    "team_description" TEXT,
    "domain_id" INTEGER,
    "status" "public"."TeamStatus",
    "visibility" "public"."TeamVisibility",
    "max_members" INTEGER,
    "isHiring" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" INTEGER,

    CONSTRAINT "team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "public"."teammember" (
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_in_team" "public"."TeamRole",

    CONSTRAINT "teammember_pkey" PRIMARY KEY ("team_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."teamapplication" (
    "application_id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teamapplication_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "public"."teamcomment" (
    "comment_id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teamcomment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "public"."paper" (
    "paper_id" SERIAL NOT NULL,
    "title" TEXT,
    "abstract" TEXT,
    "status" "public"."PaperStatus" DEFAULT 'PENDING',
    "team_id" INTEGER,
    "submitted_by" INTEGER,
    "pdf_path" TEXT,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paper_pkey" PRIMARY KEY ("paper_id")
);

-- CreateTable
CREATE TABLE "public"."proposal" (
    "proposal_id" SERIAL NOT NULL,
    "title" TEXT,
    "abstract" TEXT,
    "status" "public"."PaperStatus" DEFAULT 'PENDING',
    "team_id" INTEGER,
    "submitted_by" INTEGER,
    "pdf_path" TEXT,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "public"."reviewerassignment" (
    "assignment_id" SERIAL NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "proposal_id" INTEGER,
    "paper_id" INTEGER,
    "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "reviewerassignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "public"."userdomain" (
    "user_id" INTEGER NOT NULL,
    "domain_id" INTEGER NOT NULL,

    CONSTRAINT "userdomain_pkey" PRIMARY KEY ("user_id","domain_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "department_department_name_key" ON "public"."department"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "domain_domain_name_key" ON "public"."domain"("domain_name");

-- CreateIndex
CREATE UNIQUE INDEX "reviewer_teacher_id_key" ON "public"."reviewer"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "teamapplication_team_id_student_id_key" ON "public"."teamapplication"("team_id", "student_id");

-- AddForeignKey
ALTER TABLE "public"."admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departmentdomain" ADD CONSTRAINT "departmentdomain_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departmentdomain" ADD CONSTRAINT "departmentdomain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generaluser" ADD CONSTRAINT "generaluser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher" ADD CONSTRAINT "teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher" ADD CONSTRAINT "teacher_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewer" ADD CONSTRAINT "reviewer_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team" ADD CONSTRAINT "team_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team" ADD CONSTRAINT "team_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teammember" ADD CONSTRAINT "teammember_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teammember" ADD CONSTRAINT "teammember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamapplication" ADD CONSTRAINT "teamapplication_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamapplication" ADD CONSTRAINT "teamapplication_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamcomment" ADD CONSTRAINT "teamcomment_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamcomment" ADD CONSTRAINT "teamcomment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paper" ADD CONSTRAINT "paper_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paper" ADD CONSTRAINT "paper_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal" ADD CONSTRAINT "proposal_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal" ADD CONSTRAINT "proposal_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewer"("reviewer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposal"("proposal_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "public"."paper"("paper_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewer"("reviewer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposal"("proposal_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "public"."paper"("paper_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userdomain" ADD CONSTRAINT "userdomain_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userdomain" ADD CONSTRAINT "userdomain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;
