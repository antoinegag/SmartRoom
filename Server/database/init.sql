CREATE DATABASE IF NOT EXISTS room_data;

USE room_data;

GRANT ALL PRIVILEGES ON room_data.* TO 'smartroom'@'localhost';

CREATE TABLE IF NOT EXISTS `temperature` (
	`date` datetime DEFAULT CURRENT_TIMESTAMP,
	`value` decimal(6,2),
	PRIMARY KEY( `date` )
);

CREATE TABLE IF NOT EXISTS `light` (
	`date` datetime DEFAULT CURRENT_TIMESTAMP,
	`value` int(7),
	PRIMARY KEY( `date` )
);

CREATE TABLE IF NOT EXISTS `log` (
	`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`date` datetime DEFAULT CURRENT_TIMESTAMP,
	`level` varchar(255) DEFAULT "NONE",
	`msg` varchar(255)
);