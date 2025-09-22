/*
  Warnings:

  - You are about to drop the column `max_assignments` on the `reviewer` table. All the data in the column will be lost.
  - You are about to drop the column `self_inactive` on the `reviewer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."reviewer" DROP COLUMN "max_assignments",
DROP COLUMN "self_inactive";
