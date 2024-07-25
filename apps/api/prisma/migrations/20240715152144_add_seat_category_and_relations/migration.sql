/*
  Warnings:

  - You are about to drop the column `maxSeats` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `maxBuy` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatCategoryId` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `ticket_eventId_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `maxSeats`,
    DROP COLUMN `price`,
    ADD COLUMN `maxBuy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `eventId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `seatCategoryId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `SeatCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `maxSeats` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SeatCategory` ADD CONSTRAINT `SeatCategory_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_seatCategoryId_fkey` FOREIGN KEY (`seatCategoryId`) REFERENCES `SeatCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
