-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR(100) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
