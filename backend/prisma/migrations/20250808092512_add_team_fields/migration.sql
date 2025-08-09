-- CreateEnum
CREATE TYPE "public"."TeamStatus" AS ENUM ('ACTIVE', 'RECRUITING', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."TeamVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."proposal" ADD COLUMN     "document_url" TEXT;

-- AlterTable
ALTER TABLE "public"."team" ADD COLUMN     "domain_id" INTEGER,
ADD COLUMN     "max_members" INTEGER,
ADD COLUMN     "status" "public"."TeamStatus",
ADD COLUMN     "team_description" TEXT,
ADD COLUMN     "visibility" "public"."TeamVisibility";

-- AddForeignKey
ALTER TABLE "public"."team" ADD CONSTRAINT "team_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("domain_id") ON DELETE SET NULL ON UPDATE CASCADE;
