/*
 Navicat Premium Data Transfer

 Source Server         : MySQL92
 Source Server Type    : MySQL
 Source Server Version : 90200
 Source Host           : localhost:3306
 Source Schema         : enote_db

 Target Server Type    : MySQL
 Target Server Version : 90200
 File Encoding         : 65001

 Date: 15/04/2025 16:14:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attachments
-- ----------------------------
DROP TABLE IF EXISTS `attachments`;
CREATE TABLE `attachments`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_size` int NULL DEFAULT NULL,
  `file_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `uploaded_at` datetime(6) NULL DEFAULT NULL,
  `note_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKada67pertq4gnntow8284gvpt`(`note_id` ASC) USING BTREE,
  CONSTRAINT `FKada67pertq4gnntow8284gvpt` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for blocks
-- ----------------------------
DROP TABLE IF EXISTS `blocks`;
CREATE TABLE `blocks`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `block_type` enum('CODE','HEADING','IMAGE','LIST','QUOTE','TEXT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `order_num` int NOT NULL,
  `updated_at` datetime(6) NULL DEFAULT NULL,
  `note_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK1wa5q0w0a9wk8jf8a92r4ssg1`(`note_id` ASC) USING BTREE,
  CONSTRAINT `FK1wa5q0w0a9wk8jf8a92r4ssg1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_name_user_id`(`name` ASC, `user_id` ASC) USING BTREE,
  INDEX `FKghuylkwuedgl2qahxjt8g41kb`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FKghuylkwuedgl2qahxjt8g41kb` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for drawings
-- ----------------------------
DROP TABLE IF EXISTS `drawings`;
CREATE TABLE `drawings`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `svg_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `note_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK85slporeexf6h6xiw620wu4t`(`note_id` ASC) USING BTREE,
  CONSTRAINT `FK85slporeexf6h6xiw620wu4t` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for note_tags
-- ----------------------------
DROP TABLE IF EXISTS `note_tags`;
CREATE TABLE `note_tags`  (
  `note_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`note_id`, `tag_id`) USING BTREE,
  INDEX `FK8babdwu6uqiu4rdkeuy8dkna0`(`tag_id` ASC) USING BTREE,
  CONSTRAINT `FK8babdwu6uqiu4rdkeuy8dkna0` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKb15yxop81senc5xs5tjrsy4k4` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for notes
-- ----------------------------
DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `is_deleted` bit(1) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `updated_at` datetime(6) NULL DEFAULT NULL,
  `category_id` bigint NULL DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_category`(`user_id` ASC, `category_id` ASC) USING BTREE,
  INDEX `idx_title`(`title` ASC) USING BTREE,
  INDEX `FKt8k9l9q6louhlu7udo6r6l1et`(`category_id` ASC) USING BTREE,
  CONSTRAINT `FKechaouoa6kus6k1dpix1u91c` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKt8k9l9q6louhlu7udo6r6l1et` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_tag_name_user_id`(`name` ASC, `user_id` ASC) USING BTREE,
  INDEX `FKpsynysaxl7cyw8mr5c8xevneg`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FKpsynysaxl7cyw8mr5c8xevneg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_note_permissions
-- ----------------------------
DROP TABLE IF EXISTS `user_note_permissions`;
CREATE TABLE `user_note_permissions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `granted_at` datetime(6) NULL DEFAULT NULL,
  `permission_type` enum('EDIT','READ') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `granted_by` bigint NOT NULL,
  `note_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_note`(`user_id` ASC, `note_id` ASC) USING BTREE,
  INDEX `FKluk4a0xamrj9ycm3d3p301u37`(`granted_by` ASC) USING BTREE,
  INDEX `FK7ou7m2topf2m2ggcrd92bafip`(`note_id` ASC) USING BTREE,
  CONSTRAINT `FK7ou7m2topf2m2ggcrd92bafip` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKfw597ojlbo68x1d7m8byf5g5m` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKluk4a0xamrj9ycm3d3p301u37` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_login` datetime(6) NULL DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('ADMIN','USER') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('ACTIVE','INACTIVE','LOCKED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `updated_at` datetime(6) NULL DEFAULT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UK_6dotkott2kjsp8vw4d0m25fb7`(`email` ASC) USING BTREE,
  UNIQUE INDEX `UK_r43af9ap4edm43mmtq01oddj6`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
