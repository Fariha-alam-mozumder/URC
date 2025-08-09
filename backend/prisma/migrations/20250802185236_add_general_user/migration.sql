-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'GENERALUSER';

-- AlterTable
CREATE SEQUENCE "public".user_user_id_seq;
ALTER TABLE "public"."user" ALTER COLUMN "user_id" SET DEFAULT nextval('"public".user_user_id_seq');
ALTER SEQUENCE "public".user_user_id_seq OWNED BY "public"."user"."user_id";

-- CreateTable
CREATE TABLE "public"."generaluser" (
    "generaluser_id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "generaluser_pkey" PRIMARY KEY ("generaluser_id")
);

-- AddForeignKey
ALTER TABLE "public"."generaluser" ADD CONSTRAINT "generaluser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
