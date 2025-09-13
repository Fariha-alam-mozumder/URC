-- AlterTable
CREATE SEQUENCE "public".reviewer_reviewer_id_seq;
ALTER TABLE "public"."reviewer" ALTER COLUMN "reviewer_id" SET DEFAULT nextval('"public".reviewer_reviewer_id_seq');
ALTER SEQUENCE "public".reviewer_reviewer_id_seq OWNED BY "public"."reviewer"."reviewer_id";
