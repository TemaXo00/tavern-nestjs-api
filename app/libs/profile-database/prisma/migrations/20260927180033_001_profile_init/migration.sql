-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('EVENT', 'FRIENDSHIP', 'REPORT', 'BLOCK', 'EARLY_UNBLOCK');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "name" TEXT,
    "surname" TEXT,
    "email" TEXT NOT NULL,
    "avatar_id" TEXT,
    "reputation_score" INTEGER NOT NULL DEFAULT 0,
    "currentActivity" "ActivityType" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "action" "Actions" NOT NULL,
    "message" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_activities" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "status" "ActivityType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_socials" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "social_name" VARCHAR(50) NOT NULL,
    "social_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_socials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nickname_key" ON "profiles"("nickname");

-- CreateIndex
CREATE INDEX "reputation_action_idx" ON "reputation"("action");

-- CreateIndex
CREATE INDEX "reputation_profile_id_idx" ON "reputation"("profile_id");

-- CreateIndex
CREATE INDEX "profile_activities_status_idx" ON "profile_activities"("status");

-- CreateIndex
CREATE INDEX "profile_activities_profile_id_idx" ON "profile_activities"("profile_id");

-- CreateIndex
CREATE INDEX "profile_socials_profile_id_idx" ON "profile_socials"("profile_id");

-- AddForeignKey
ALTER TABLE "reputation" ADD CONSTRAINT "reputation_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_activities" ADD CONSTRAINT "profile_activities_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_socials" ADD CONSTRAINT "profile_socials_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
