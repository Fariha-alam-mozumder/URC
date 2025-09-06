/*
  Warnings:

  - You are about to drop the `reviewerpreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."reviewerpreference" DROP CONSTRAINT "reviewerpreference_domain_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviewerpreference" DROP CONSTRAINT "reviewerpreference_reviewer_id_fkey";

-- DropTable
DROP TABLE "public"."reviewerpreference";
