/*
  Warnings:

  - The values [ACCEPTED,REJECTED] on the enum `PaperStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaperStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'UNDER_REVIEW');
ALTER TABLE "public"."paper" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."proposal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."paper" ALTER COLUMN "status" TYPE "public"."PaperStatus_new" USING ("status"::text::"public"."PaperStatus_new");
ALTER TABLE "public"."proposal" ALTER COLUMN "status" TYPE "public"."PaperStatus_new" USING ("status"::text::"public"."PaperStatus_new");
ALTER TYPE "public"."PaperStatus" RENAME TO "PaperStatus_old";
ALTER TYPE "public"."PaperStatus_new" RENAME TO "PaperStatus";
DROP TYPE "public"."PaperStatus_old";
ALTER TABLE "public"."paper" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "public"."proposal" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
