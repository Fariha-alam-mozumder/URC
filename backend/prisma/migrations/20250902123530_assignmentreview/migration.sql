/*
  Warnings:

  - You are about to drop the column `assigned_by` on the `reviewerassignment` table. All the data in the column will be lost.
  - Added the required column `due_date` to the `reviewerassignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AssignmentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

-- DropForeignKey
ALTER TABLE "public"."reviewerassignment" DROP CONSTRAINT "reviewerassignment_assigned_by_fkey";

-- AlterTable
ALTER TABLE "public"."reviewerassignment" DROP COLUMN "assigned_by",
ADD COLUMN     "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'PENDING';
