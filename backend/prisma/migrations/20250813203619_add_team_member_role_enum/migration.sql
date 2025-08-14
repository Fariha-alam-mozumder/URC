/*
  Warnings:

  - The `status` column on the `paper` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `proposal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role_in_team` column on the `teammember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[teacher_id]` on the table `reviewer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."TeamMemberRole" AS ENUM ('LEAD', 'ASSISTANT', 'RESEARCHER', 'MEMBER', 'COLLABORATOR');

-- CreateEnum
CREATE TYPE "public"."ReviewerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "public"."paper" DROP COLUMN "status",
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "public"."proposal" DROP COLUMN "status",
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "public"."reviewer" ADD COLUMN     "status" "public"."ReviewerStatus" DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "public"."teammember" DROP COLUMN "role_in_team",
ADD COLUMN     "role_in_team" "public"."TeamMemberRole";

-- DropEnum
DROP TYPE "public"."PaperStatus";

-- DropEnum
DROP TYPE "public"."TeamRole";

-- CreateIndex
CREATE UNIQUE INDEX "reviewer_teacher_id_key" ON "public"."reviewer"("teacher_id");
