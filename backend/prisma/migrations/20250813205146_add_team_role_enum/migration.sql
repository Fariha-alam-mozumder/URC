/*
  Warnings:

  - The `status` column on the `paper` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `proposal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role_in_team` column on the `teammember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."TeamRole" AS ENUM ('LEAD', 'RESEARCHER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "public"."PaperStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'UNDER_REVIEW');

-- AlterTable
ALTER TABLE "public"."paper" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PaperStatus" DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."proposal" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PaperStatus" DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."teammember" DROP COLUMN "role_in_team",
ADD COLUMN     "role_in_team" "public"."TeamRole";

-- DropEnum
DROP TYPE "public"."TeamMemberRole";
