-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "githubProfileId" TEXT;

-- CreateTable
CREATE TABLE "public"."GitHubProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "followersCount" INTEGER NOT NULL,
    "followingCount" INTEGER NOT NULL,
    "repositoriesCount" INTEGER NOT NULL,
    "topRepositories" JSONB,
    "contributionsTotal" INTEGER,
    "contributionsCalendar" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProfile_userId_key" ON "public"."GitHubProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."GitHubProfile" ADD CONSTRAINT "GitHubProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
