/*
  Warnings:

  - A unique constraint covering the columns `[department_name]` on the table `department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "department_department_name_key" ON "public"."department"("department_name");
