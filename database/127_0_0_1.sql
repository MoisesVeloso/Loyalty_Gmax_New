-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 10:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gmax`
--
CREATE DATABASE IF NOT EXISTS `gmax` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gmax`;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` varchar(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `birthday` date NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Male','Female','Other','Non-Binary','Prefer not to say') NOT NULL,
  `marital_status` enum('Single','Married','Married with Kids','Divorced','Widowed') NOT NULL,
  `cust_type` enum('Customer','Reseller') NOT NULL DEFAULT 'Customer',
  `has_physical_store` tinyint(1) NOT NULL DEFAULT 0,
  `store_name` varchar(255) DEFAULT NULL,
  `store_address` varchar(255) DEFAULT NULL,
  `tin_number` varchar(50) DEFAULT NULL,
  `sales_channel` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `data_consent` tinyint(1) NOT NULL DEFAULT 0,
  `marketing_consent` tinyint(1) NOT NULL DEFAULT 0,
  `hear_about` varchar(255) NOT NULL,
  `date_registered` timestamp NOT NULL DEFAULT current_timestamp(),
  `consent_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `stamps` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `full_name`, `contact_number`, `birthday`, `age`, `gender`, `marital_status`, `cust_type`, `has_physical_store`, `store_name`, `store_address`, `tin_number`, `sales_channel`, `city`, `email`, `data_consent`, `marketing_consent`, `hear_about`, `date_registered`, `consent_timestamp`, `stamps`) VALUES
('LC1', 'Marilou Moral', '09955070912', '1976-03-11', 49, 'Female', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Mandaluyong', 'mbmoral21@gmail.com', 1, 1, 'Walk-in', '2026-02-07 02:19:41', '2026-02-07 02:19:41', 1),
('LC10', 'Sherylle F. Gomez', '09176373964', '1981-08-03', 44, 'Female', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'other', 'sherylgomez0803@gmail.com', 1, 0, 'Walk-in', '2026-02-10 01:47:25', '2026-02-10 01:47:25', 1),
('LC11', 'Gener Mabunga', '09668276679', '1994-03-23', 31, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Valenzuela', 'genermabunga1994@gmail.com', 1, 0, 'Walk-in', '2026-02-10 09:18:34', '2026-02-11 09:18:34', 1),
('LC12', 'Angelo Q. Duzon', '09631758904', '1986-12-11', 39, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Navotas', 'angelduzon63@gmail.com', 1, 0, 'Social Media', '2026-02-10 09:23:11', '2026-02-11 09:23:11', 1),
('LC13', 'Cecile Arnejo', '09634992709', '1980-04-14', 45, 'Female', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', NULL, 1, 1, 'Walk-in', '2026-02-11 07:03:01', '2026-02-11 07:03:01', 2),
('LC14', 'Geralyn Gagatam', '09395999833', '1990-09-22', 35, 'Female', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', NULL, 1, 1, 'Walk-in', '2026-02-11 07:28:18', '2026-02-11 07:28:18', 1),
('LC15', 'PJ Francisco', '09619977806', '1992-10-11', 33, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', '8pjfrancisco@gmail.com', 1, 0, 'Walk-in', '2026-02-12 02:49:19', '2026-02-12 02:49:19', 2),
('LC16', 'Marie Bernardo', '09286319418', '1976-01-10', 50, 'Female', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Caloocan', NULL, 1, 0, 'Walk-in', '2026-02-12 06:10:03', '2026-02-12 06:10:03', 1),
('LC17', 'bobby fajardo', '09152039421', '1986-04-14', 39, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'other', 'bobbyfajardo1410.bani@gmail.com', 1, 0, 'Walk-in', '2026-02-12 08:36:33', '2026-02-12 08:36:33', 1),
('LC18', 'Mateo Sor', '09634412759', '1989-02-26', 36, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'other', NULL, 1, 0, 'Social Media', '2026-02-13 05:35:43', '2026-02-13 05:35:43', 0),
('LC19', 'spencer felix', '09488862291', '1998-06-18', 27, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'San Pedro', 'emmanuelspencermarollanofelix@gmail.com', 1, 0, 'Walk-in', '2026-02-13 06:35:19', '2026-02-13 06:35:19', 3),
('LC2', 'Gabbuat Jowel', '09063556853', '1985-06-09', 40, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Quezon City', 'jpgabbuat@gmail.com', 1, 1, 'Walk-in', '2026-02-07 02:26:16', '2026-02-07 02:26:16', 1),
('LC20', 'jade clint B. Mesias', '09262712533', '2000-01-12', 26, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Taguig', 'mesiasjadeclint@gmail.com', 1, 0, 'Walk-in', '2026-02-13 08:38:17', '2026-02-13 08:38:17', 1),
('LC21', 'john karl bien', '09171760255', '1991-01-13', 35, 'Male', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'San Juan', 'johnkarl.bien@yahoo.com.sg', 1, 0, 'Social Media', '2026-02-14 04:36:27', '2026-02-14 04:36:27', 1),
('LC22', 'Van Mike Cabay', '09915315611', '2010-06-22', 15, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', 'vanmikecabay@gmail.com', 1, 0, 'Walk-in', '2026-02-14 06:16:50', '2026-02-14 06:16:50', 1),
('LC23', 'Cherry Quitoriano', '09152163228', '1982-01-05', 44, 'Female', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Caloocan', 'quitorianocherry091@gmail.com', 1, 1, 'Walk-in', '2026-02-19 06:57:06', '2026-02-19 06:57:06', 1),
('LC24', 'Roderick Arellano', '09162084035', '1981-07-28', 44, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', 'roderickarellano2814@gmail.com', 1, 1, 'Walk-in', '2026-02-19 08:24:02', '2026-02-19 08:24:02', 0),
('LC25', 'Babeth Garcia', '09637104310', '1974-11-29', 51, 'Female', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', NULL, 1, 0, 'Social Media', '2026-02-20 06:32:55', '2026-02-20 06:32:55', 1),
('LC26', 'ROSE ANN B. CABRAL', '09260812622', '1986-08-28', 39, 'Female', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Mandaluyong', NULL, 1, 0, 'Walk-in', '2026-02-20 09:38:49', '2026-02-20 09:38:49', 1),
('LC27', 'MA.JERNY ESLAO', '09174851207', '1992-07-13', 33, 'Female', 'Married with Kids', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', NULL, 1, 0, 'Walk-in', '2026-02-26 05:40:25', '2026-02-26 05:40:25', 1),
('LC28', 'Michelle Briones', '09428549628', '1998-05-18', 27, 'Female', 'Married with Kids', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', 'mj691u@gmail.com', 1, 1, 'Walk-in', '2026-02-27 02:58:38', '2026-02-27 02:58:38', 3),
('LC29', 'ALEX DELA CRUZ', '09084460001', '1976-05-26', 49, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Pasay', NULL, 1, 0, 'Walk-in', '2026-02-27 08:09:28', '2026-02-27 08:09:28', 1),
('LC3', 'Merry Grace Valiente', '09709945626', '2000-11-13', 25, 'Female', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'General Trias', 'merrygracevaliente76@gmail.com', 1, 0, 'Walk-in', '2026-02-07 04:16:59', '2026-02-07 04:16:59', 1),
('LC31', 'Marlo Guillermo', '09171135221', '1964-06-02', 61, 'Male', 'Married', 'Reseller', 0, NULL, NULL, NULL, 'Other', 'other', NULL, 1, 0, 'Walk-in', '2026-03-04 02:02:10', '2026-03-04 02:02:10', 1),
('LC4', 'Jerremy Buenaflor', '09296406468', '1988-11-25', 37, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Caloocan', 'jbuenaflor69@gmail.com', 1, 1, 'Walk-in', '2026-02-07 06:43:19', '2026-02-07 06:43:19', 1),
('LC5', 'Edwin Galang', '09912267387', '1972-01-02', 54, 'Male', 'Single', 'Customer', 0, NULL, NULL, NULL, NULL, 'Parañaque', 'edwingalang45@gmail.com', 1, 1, 'Social Media', '2026-02-07 07:01:26', '2026-02-07 07:01:26', 1),
('LC6', 'Anacorita Maquinto', '09101385898', '1969-10-18', 56, 'Female', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', 'bodochamiccamiles@gmail.com', 1, 0, 'Walk-in', '2026-02-07 07:26:37', '2026-02-07 07:26:37', 1),
('LC7', 'Crisanto Garcia', '09954180273', '1982-04-06', 43, 'Male', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Caloocan', 'chgsix30@gmail.com', 1, 0, 'Walk-in', '2026-02-08 08:07:50', '2026-02-08 08:07:50', 1),
('LC8', 'Greg Pederes', '09694410143', '1968-11-18', 57, 'Male', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', NULL, 1, 1, 'Walk-in', '2026-02-09 08:29:22', '2026-02-09 08:29:22', 1),
('LC9', 'Edgar M. Riano', '09999999999', '1970-08-04', 55, 'Male', 'Married', 'Customer', 0, NULL, NULL, NULL, NULL, 'Manila', NULL, 1, 0, 'Walk-in', '2026-02-09 08:32:56', '2026-02-09 08:32:56', 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `customer_id` varchar(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `stamps_earned` int(11) NOT NULL,
  `invoice_number` varchar(100) DEFAULT NULL,
  `is_gift` tinyint(1) NOT NULL DEFAULT 0,
  `gift_item` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `customer_id`, `date`, `description`, `amount`, `stamps_earned`, `invoice_number`, `is_gift`, `gift_item`) VALUES
(1, 'LC1', '2026-02-06 18:28:00', '1 - GS2020D', 1720.00, 1, '11389', 1, 'Calendar'),
(2, 'LC2', '2026-02-06 18:29:00', '2 - Saturn', 2820.00, 1, '11390', 1, 'Calendar'),
(3, 'LC3', '2026-02-06 20:18:00', '1-PARTYBOX-1044', 6400.00, 1, '11392', 1, '1-CALENDAR'),
(4, 'LC4', '2026-02-06 22:43:00', '1 - Led2087', 2650.00, 1, '11394', 1, 'Calendar'),
(5, 'LC5', '2026-02-07 00:30:00', '1 - GK3258, 1 - VERSADRIVE10, 1 - SMARTKTV-4062, 1 - LED2477', 22725.00, 1, '11396', 1, 'Calendar'),
(6, 'LC6', '2026-02-07 00:31:00', '1 - GK8899R', 1725.00, 1, '11397', 1, 'Calendar'),
(7, 'LC7', '2026-02-08 00:08:00', '1 - Partybox1044', 6300.00, 1, '11408', 1, 'Calendar'),
(8, 'LC8', '2026-02-09 00:36:00', '1 - Max 82', 935.00, 1, '11413', 1, 'Calendar'),
(9, 'LC9', '2026-02-09 00:37:00', '1 - ST8585', 3400.00, 1, '11414', 1, 'Calendar'),
(10, 'LC10', '2026-02-09 17:47:00', '1-ultrapro-210r, 1-bl-153, 1-grc-1227', 9425.00, 1, '11416', 1, '1-calendar'),
(12, 'LC14', '2026-02-11 23:55:00', '1 - Espresso Pot', 315.00, 1, '11433', 1, 'Calendar'),
(13, 'LC16', '2026-02-11 23:57:00', '3  - Max-82', 2805.00, 1, '11441', 1, 'Calendar'),
(14, 'LC15', '2026-02-11 23:58:00', '1 - MC-UHF-202R', 1325.00, 1, '11439', 1, 'Calendar'),
(15, 'LC13', '2026-02-11 00:00:00', '1 - Bluetrekpa 08', 935.00, 1, '11431', 1, 'Calendar'),
(16, 'LC13', '2026-02-11 00:01:00', '1 - PFI-1324p', 385.00, 1, '11432', 1, 'Calendar'),
(17, 'LC12', '2026-02-10 00:03:00', '1 - Thunderbox 215', 10500.00, 1, '11423', 1, 'Calendar'),
(18, 'LC11', '2026-02-10 00:04:00', '1 - LED-2477', 3700.00, 1, '11417', 1, 'Calendar'),
(19, 'LC17', '2026-02-12 00:36:00', '1-TPRO-SET10, 2-TALLBOY, MC-UHF-203R', 15400.00, 1, '11443', 1, '1-CALENDAR'),
(20, 'LC19', '2026-02-12 22:38:00', '1-mc-uhf-202r, 1-aurabar', 2320.00, 1, '11449/11450', 1, '1-calendar'),
(21, 'LC20', '2026-02-13 01:13:00', '1 - Hotpot-180, 1 - MRC-0627', 1220.00, 1, '11452', 1, 'Calendar'),
(22, 'LC22', '2026-02-14 00:36:00', '1 - KTVPBOXM212', 10300.00, 1, '11456', 1, 'Calendar'),
(23, 'LC21', '2026-02-14 23:24:00', '1 - ST8585', 3215.00, 1, '11454', 1, '1 - Calendar'),
(24, 'LC23', '2026-02-18 22:01:00', '1 - ULTRAMAX212A', 10500.00, 1, '11516', 1, '1 - Calendar'),
(25, 'LC19', '2026-02-18 23:54:00', '1 - MCPRO58k', 275.00, 1, '11506', 0, NULL),
(26, 'LC26', '2026-02-20 01:39:00', '1-BLUETREK-PA18', 7450.00, 1, '11533', 1, '1-CALENDAR'),
(27, 'LC27', '2026-02-25 22:01:00', '1-BEATSPRO-65', 1925.00, 1, '11591', 1, '1-CALENDAR'),
(28, 'LC28', '2026-02-26 19:00:00', '1-GS-233T', 890.00, 1, '11600', 1, '1-Calendar'),
(29, 'LC29', '2026-02-27 00:11:00', '1-ULTRAPRO-210R', 8035.00, 1, '11609', 1, '1-CALENDAR'),
(30, 'LC25', '2026-02-27 00:14:00', '1-URC-360 / 1-MAXHEAT-44S', 3310.00, 1, '11610', 1, '1-CALENDAR'),
(31, 'LC15', '2026-02-27 00:15:00', '1-ORION', 1155.00, 1, '11606', 1, '1-CALENDAR'),
(33, 'LC31', '2026-03-03 18:06:00', '2 - GK3258, 1 PARTYBOX, 1 - SKYWALKER 15', 20700.00, 1, '11669', 1, '2 - Calendar'),
(34, 'LC19', '2026-03-11 00:28:00', '1 - Bluetrekpa15 New', 4280.00, 1, '11750', 0, NULL),
(35, 'LC28', '2026-03-14 20:50:00', '1 - Sonic Go', 1870.00, 1, '11793', 0, NULL),
(36, 'LC28', '2026-02-23 20:51:00', '1 - Ganzklar', 1790.00, 1, '11568', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact_number` (`contact_number`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transactions_customer_id` (`customer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
