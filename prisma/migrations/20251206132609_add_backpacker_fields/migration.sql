/*
  Warnings:

  - You are about to drop the column `name` on the `rental_bookings` table. All the data in the column will be lost.
  - Added the required column `address` to the `rental_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentId` to the `rental_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `rental_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeks` to the `rental_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_bookings" DROP COLUMN "name",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "documentId" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "weeks" INTEGER NOT NULL,
ALTER COLUMN "bikeType" SET DEFAULT 'backpacker',
ALTER COLUMN "phone" DROP NOT NULL;
