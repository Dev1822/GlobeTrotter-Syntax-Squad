-- ============================================================
-- GlobeTrotter Database Schema
-- MySQL 8.x compatible
-- ============================================================

-- -----------------------------------------------------------
-- 1. Users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Users` (
    `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `email`         VARCHAR(255)    NOT NULL,
    `passwordHash`  VARCHAR(255)    NOT NULL,
    `displayName`   VARCHAR(100)    DEFAULT NULL,
    `avatarUrl`     VARCHAR(512)    DEFAULT NULL,
    `createdAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 2. Trips
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Trips` (
    `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `userId`        INT UNSIGNED    NOT NULL,
    `title`         VARCHAR(255)    NOT NULL,
    `description`   TEXT            DEFAULT NULL,
    `startDate`     DATE            DEFAULT NULL,
    `endDate`       DATE            DEFAULT NULL,
    `coverImageUrl` VARCHAR(512)    DEFAULT NULL,
    `createdAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_trips_userId` (`userId`),
    CONSTRAINT `fk_trips_userId` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 3. TripStops  (a destination / city within a trip)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `TripStops` (
    `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `tripId`        INT UNSIGNED    NOT NULL,
    `name`          VARCHAR(255)    NOT NULL          COMMENT 'City or place name',
    `arrivalDate`   DATE            DEFAULT NULL,
    `departureDate` DATE            DEFAULT NULL,
    `latitude`      DECIMAL(10,7)   DEFAULT NULL,
    `longitude`     DECIMAL(10,7)   DEFAULT NULL,
    `orderIndex`    INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT 'Drag-and-drop ordering within the trip',
    `createdAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_tripstops_tripId` (`tripId`),
    CONSTRAINT `fk_tripstops_tripId` FOREIGN KEY (`tripId`) REFERENCES `Trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 4. Activities  (things to do at a TripStop)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Activities` (
    `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `tripStopId`    INT UNSIGNED    NOT NULL          COMMENT 'FK → TripStops.id – every activity belongs to a stop',

    -- Core fields
    `name`          VARCHAR(255)    NOT NULL          COMMENT 'Activity title, e.g. "Visit Eiffel Tower"',
    `date`          DATE            NOT NULL          COMMENT 'Scheduled date of the activity',
    `startTime`     TIME            DEFAULT NULL      COMMENT 'Planned start time (HH:MM:SS)',
    `endTime`       TIME            DEFAULT NULL      COMMENT 'Planned end time   (HH:MM:SS)',
    `estimatedCost` DECIMAL(10,2)   DEFAULT 0.00      COMMENT 'Estimated cost in trip currency',
    `notes`         TEXT            DEFAULT NULL      COMMENT 'Free-form notes / description',
    `orderIndex`    INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT 'Position for drag-and-drop sorting within a date',

    -- Timestamps
    `createdAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),

    -- Fast lookup: all activities for a given stop, ordered by date then position
    KEY `idx_activities_tripStopId_date` (`tripStopId`, `date`, `orderIndex`),

    CONSTRAINT `fk_activities_tripStopId`
        FOREIGN KEY (`tripStopId`) REFERENCES `TripStops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
