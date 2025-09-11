/*
  Warnings:

  - You are about to drop the column `domain_id` on the `paper` table. All the data in the column will be lost.
  - You are about to drop the column `domain_id` on the `proposal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."paper" DROP CONSTRAINT "paper_domain_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."proposal" DROP CONSTRAINT "proposal_domain_id_fkey";

-- AlterTable
ALTER TABLE "public"."paper" DROP COLUMN "domain_id";

-- AlterTable
ALTER TABLE "public"."proposal" DROP COLUMN "domain_id";
