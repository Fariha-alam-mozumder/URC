/*
  Warnings:

  - The `decision` column on the `review` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ReviewDecision" AS ENUM ('ACCEPT', 'REJECT', 'MINOR_REVISIONS', 'MAJOR_REVISIONS');

-- AlterTable
ALTER TABLE "public"."paper" ADD COLUMN     "aggregated_decided_at" TIMESTAMP(3),
ADD COLUMN     "aggregated_decision" "public"."ReviewDecision";

-- AlterTable
ALTER TABLE "public"."proposal" ADD COLUMN     "aggregated_decided_at" TIMESTAMP(3),
ADD COLUMN     "aggregated_decision" "public"."ReviewDecision";

-- AlterTable
ALTER TABLE "public"."review" ADD COLUMN     "attachment_path" TEXT,
DROP COLUMN "decision",
ADD COLUMN     "decision" "public"."ReviewDecision";

-- AlterTable
ALTER TABLE "public"."reviewerassignment" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "started_at" TIMESTAMP(3);
