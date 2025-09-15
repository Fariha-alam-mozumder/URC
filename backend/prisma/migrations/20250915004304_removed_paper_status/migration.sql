/*
  Warnings:

  - The values [ACCEPTED,REJECTED] on the enum `PaperStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUSPENDED,PENDING] on the enum `ReviewerStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaperStatus_new" AS ENUM ('PENDING', 'UNDER_REVIEW');
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

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReviewerStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "public"."reviewer" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."reviewer" ALTER COLUMN "status" TYPE "public"."ReviewerStatus_new" USING ("status"::text::"public"."ReviewerStatus_new");
ALTER TYPE "public"."ReviewerStatus" RENAME TO "ReviewerStatus_old";
ALTER TYPE "public"."ReviewerStatus_new" RENAME TO "ReviewerStatus";
DROP TYPE "public"."ReviewerStatus_old";
ALTER TABLE "public"."reviewer" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
