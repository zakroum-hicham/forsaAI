-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
