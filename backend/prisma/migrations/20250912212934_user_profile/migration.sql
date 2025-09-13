-- AlterTable
ALTER TABLE "public"."departmentdomain" ALTER COLUMN "department_id" DROP DEFAULT;
DROP SEQUENCE "departmentdomain_department_id_seq";

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "profile_image" TEXT;
