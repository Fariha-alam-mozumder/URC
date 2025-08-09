/*
  Warnings:

  - You are about to drop the `pc_chairman` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."pc_chairman" DROP CONSTRAINT "pc_chairman_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviewerassignment" DROP CONSTRAINT "reviewerassignment_assigned_by_fkey";

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."pc_chairman";

-- CreateTable
CREATE TABLE "public"."admin" (
    "admin_id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- AddForeignKey
ALTER TABLE "public"."admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewerassignment" ADD CONSTRAINT "reviewerassignment_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "public"."admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;
