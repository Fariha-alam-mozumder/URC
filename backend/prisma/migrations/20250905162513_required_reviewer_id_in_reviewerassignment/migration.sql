/*
  Warnings:

  - Made the column `reviewer_id` on table `reviewerassignment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."reviewerassignment" DROP CONSTRAINT "reviewerassignment_reviewer_id_fkey";

-- AlterTable
ALTER TABLE "public"."reviewerassignment" ALTER COLUMN "reviewer_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."reviewer"("reviewer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
