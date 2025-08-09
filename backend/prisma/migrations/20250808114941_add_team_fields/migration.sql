/*
  Warnings:

  - You are about to drop the column `document_url` on the `proposal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."paper" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "file_size" INTEGER,
ADD COLUMN     "pdf_path" TEXT;

-- AlterTable
ALTER TABLE "public"."proposal" DROP COLUMN "document_url",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "file_size" INTEGER,
ADD COLUMN     "pdf_path" TEXT;

-- AlterTable
ALTER TABLE "public"."review" ADD COLUMN     "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."team" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_user_id" INTEGER,
ADD COLUMN     "isHiring" BOOLEAN;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

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

-- CreateIndex
CREATE UNIQUE INDEX "teamapplication_team_id_student_id_key" ON "public"."teamapplication"("team_id", "student_id");

-- AddForeignKey
ALTER TABLE "public"."team" ADD CONSTRAINT "team_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamapplication" ADD CONSTRAINT "teamapplication_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamapplication" ADD CONSTRAINT "teamapplication_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamcomment" ADD CONSTRAINT "teamcomment_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teamcomment" ADD CONSTRAINT "teamcomment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
