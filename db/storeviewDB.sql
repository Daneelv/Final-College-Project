-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 25, 2014 at 09:41 AM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `storeview`
--
DROP DATABASE IF EXISTS `storeview`;
CREATE DATABASE IF NOT EXISTS `storeview` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `storeview`;

-- --------------------------------------------------------

--
-- Table structure for table `tchartcategory`
--

DROP TABLE IF EXISTS `tchartcategory`;
CREATE TABLE IF NOT EXISTS `tchartcategory` (
  `pkChartCatUID` varchar(40) NOT NULL,
  `sChartCategory` varchar(40) NOT NULL,
  `dDateCreated` datetime NOT NULL,
  `dDateUpdated` datetime DEFAULT NULL,
  `blsArchived` bit(1) DEFAULT b'0',
  `dDateArchived` datetime DEFAULT NULL,
  `sArchivedReason` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`pkChartCatUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tchartcategory`
--

INSERT INTO `tchartcategory` (`pkChartCatUID`, `sChartCategory`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) VALUES
('197b4a41-cb7f-4a99-af7d-f9676ce2d648', 'CD', '2014-10-23 17:28:10', NULL, b'0', NULL, ''),
('aa335e90-5936-11e4-8185-902b345dc018', 'Music DVD', '2014-10-21 17:26:44', NULL, b'0', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tgenre`
--

DROP TABLE IF EXISTS `tgenre`;
CREATE TABLE IF NOT EXISTS `tgenre` (
  `pkGenreUID` varchar(40) NOT NULL,
  `sGenreName` varchar(255) NOT NULL,
  `sGenreDesc` varchar(255) NOT NULL,
  `dDateCreated` datetime NOT NULL,
  `dDateUpdated` datetime DEFAULT NULL,
  `blsArchived` bit(1) DEFAULT b'0',
  `dDateArchived` datetime DEFAULT NULL,
  `sArchivedReason` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`pkGenreUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tgenre`
--

INSERT INTO `tgenre` (`pkGenreUID`, `sGenreName`, `sGenreDesc`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) VALUES
('198c0eb9-febe-4a46-bab7-22cff7d710cb', 'Electronic', 'Electronic and Dance ', '2014-10-23 22:07:41', NULL, b'0', NULL, ''),
('5b79f9a5-94ef-4e6a-8c87-722d82a91422', 'Jazz', 'Saxophones and jazzy music', '2014-10-23 17:18:02', '2014-10-23 17:18:27', b'0', NULL, ''),
('b5831987-a99d-48e4-a713-a86cdc2c3843', 'Folk', '', '2014-10-23 22:11:15', NULL, b'0', NULL, ''),
('bea65103-5a2e-11e4-a136-902b345dc018', 'Pop', '', '2014-10-22 23:02:34', NULL, b'0', NULL, NULL),
('e1336847-5936-11e4-8185-902b345dc018', 'Rock', '', '2014-10-21 17:28:16', NULL, b'0', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tmedia`
--

DROP TABLE IF EXISTS `tmedia`;
CREATE TABLE IF NOT EXISTS `tmedia` (
  `pkMediaUID` varchar(40) NOT NULL,
  `sMediaName` varchar(255) NOT NULL,
  `sMediaDescription` varchar(1000) DEFAULT NULL,
  `Genre_fkGenreUID` varchar(40) NOT NULL,
  `Chart_fkChartUID` varchar(40) NOT NULL,
  `dDateCreated` datetime NOT NULL,
  `dDateUpdated` datetime DEFAULT NULL,
  `blsArchived` bit(1) DEFAULT b'0',
  `dDateArchived` datetime DEFAULT NULL,
  `sArchivedReason` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`pkMediaUID`),
  KEY `media_genre_ibfk_1` (`Genre_fkGenreUID`),
  KEY `media_chart_ibfk_1` (`Chart_fkChartUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tmedia`
--

INSERT INTO `tmedia` (`pkMediaUID`, `sMediaName`, `sMediaDescription`, `Genre_fkGenreUID`, `Chart_fkChartUID`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) VALUES
('02d8efcf-19af-4b37-ad6c-39cc7cce5d25', 'Linkin Park - Live In texas', 'DVD was shot in Texas at this years Summer Sanitarium and includes live performances of songs from Hybrid Theory, Reanimation, and Meteora.', 'e1336847-5936-11e4-8185-902b345dc018', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-23 00:38:49', '2014-10-23 00:45:43', b'0', NULL, ''),
('0f484dd8-5270-4d15-be49-d162b15e3245', 'Coldplay - Ghost Stories', 'Ghost Stories is the sixth studio album from the super-group, Coldplay.', 'e1336847-5936-11e4-8185-902b345dc018', '197b4a41-cb7f-4a99-af7d-f9676ce2d648', '2014-10-23 22:06:57', NULL, b'0', NULL, ''),
('19c60c17-559c-431e-9c8c-c316ec2d2373', 'Avicii - True', 'True is the debut studio album from Swedish DJ Avicii. Utilizing influences as diverse as country and bluegrass and fusing them with his trademark melodious EDM sound', '198c0eb9-febe-4a46-bab7-22cff7d710cb', '197b4a41-cb7f-4a99-af7d-f9676ce2d648', '2014-10-23 22:09:57', NULL, b'0', NULL, ''),
('45ba0cd0-8788-477e-8999-b356d69535d7', 'John Legend - Love In The Future', 'John Legends fourth studio album, Love in the future captures contemporary R&B and soul in an intimate album that plays as a love letter for his fiancÃ©e, supermodel, Chrissy Teigen.', 'bea65103-5a2e-11e4-a136-902b345dc018', '197b4a41-cb7f-4a99-af7d-f9676ce2d648', '2014-10-23 22:09:24', NULL, b'0', NULL, ''),
('5a028276-adb2-4c9c-9086-6a6be4386652', 'Simon & Garfunkel - Old Friends - Live On Stage', '', 'b5831987-a99d-48e4-a713-a86cdc2c3843', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-23 22:12:32', NULL, b'0', NULL, ''),
('7480ede3-54d3-4849-b8c4-0048c2be4014', 'Leonard Cohen - Songs From The Road', 'Leonard Cohen first tour in 15 years, taking him to the most prestigious and beautiful venues in every corner of the globe. He mesmerises audiences with performances that are hailed as some of the best in his career, this title contains 12 of his most pinnacle performances brought together for SONGS FROM THE ROAD.', 'b5831987-a99d-48e4-a713-a86cdc2c3843', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-23 22:14:35', NULL, b'0', NULL, ''),
('7586b93b-37a0-4640-b4e2-f3a82296099d', 'Sam Smith - In The Lonely Hour', 'In the Lonely Hour is the debut studio album by British singer-songwriter Sam Smith.', 'bea65103-5a2e-11e4-a136-902b345dc018', '197b4a41-cb7f-4a99-af7d-f9676ce2d648', '2014-10-23 22:06:23', NULL, b'0', NULL, ''),
('96e021a8-c036-413e-92e0-3475dba3d085', 'ABBA - In Concert', '', 'bea65103-5a2e-11e4-a136-902b345dc018', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-23 22:15:48', NULL, b'0', NULL, ''),
('ac739e64-bcdf-4194-a67b-61566619e4d8', 'Number Ones', 'In the U.S, it was certified Platinum in November 2005, and according to Nielsen Soundscan sold an additional 227,000 copies through to April 2007.', 'bea65103-5a2e-11e4-a136-902b345dc018', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-23 00:15:12', '2014-10-23 17:28:53', b'0', NULL, ''),
('b05098a9-e38b-4b4a-9fe6-2390a956a9c0', 'Phil Collins - The First Farewell Tour', '', 'e1336847-5936-11e4-8185-902b345dc018', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-23 22:16:39', NULL, b'0', NULL, ''),
('b3c3c4b3-5a30-11e4-a136-902b345dc018', '10 Years Of Westlife - Live At Croke Park', 'After a staggering 10 years at the top of the UK charts, pop royalty Westlife release an amazing live DVD of their massive Croke Park stadium concert', 'bea65103-5a2e-11e4-a136-902b345dc018', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-22 23:16:34', '2014-10-23 00:46:09', b'0', NULL, ''),
('c4973167-df75-4701-a9e9-3d44ff73e7ae', 'Mumford & Sons - Road To Red Rocks', 'Experience first hand MUMFORD AND SONS tour of America in this release including exclusive footage of the bands shows at Red Rocks in Colorado and documentary footage as the band travelled around the country for their GENTLEMEN ON THE ROAD tour.', 'b5831987-a99d-48e4-a713-a86cdc2c3843', 'aa335e90-5936-11e4-8185-902b345dc018', '2014-10-23 22:14:01', NULL, b'0', NULL, ''),
('d166be6a-5f07-44be-9c40-f7a3e64890ff', 'One Direction - Up All Night', 'Up All Night is the debut studio album by English-Irish boy band One Direction, released by Syco Records in November 2011.', 'bea65103-5a2e-11e4-a136-902b345dc018', '197b4a41-cb7f-4a99-af7d-f9676ce2d648', '2014-10-23 22:08:44', NULL, b'0', NULL, ''),
('fba31b61-e609-40fd-8401-f4fd8347f5ae', 'Now 66', 'The biggest and best compilation series around returns for another mammoth installment of pop hits, indie treats, urban anthems and dance floor fillers.', '198c0eb9-febe-4a46-bab7-22cff7d710cb', '197b4a41-cb7f-4a99-af7d-f9676ce2d648', '2014-10-23 22:10:26', NULL, b'0', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `tsales`
--

DROP TABLE IF EXISTS `tsales`;
CREATE TABLE IF NOT EXISTS `tsales` (
  `pkSalesUID` varchar(40) NOT NULL,
  `sWeekOfSales` datetime NOT NULL,
  `sAmount` int(11) NOT NULL,
  `Media_fkMediaUID` varchar(40) NOT NULL,
  `Store_fkStoreUID` varchar(40) NOT NULL,
  `dDateCreated` datetime NOT NULL,
  `dDateUpdated` datetime DEFAULT NULL,
  `blsArchived` bit(1) DEFAULT b'0',
  `dDateArchived` datetime DEFAULT NULL,
  `sArchivedReason` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`pkSalesUID`),
  KEY `sales_media_ibfk_1` (`Media_fkMediaUID`),
  KEY `sales_store_ibfk_1` (`Store_fkStoreUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tsales`
--

INSERT INTO `tsales` (`pkSalesUID`, `sWeekOfSales`, `sAmount`, `Media_fkMediaUID`, `Store_fkStoreUID`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) VALUES
('02389efd-5af2-11e4-8336-902b345dc018', '2014-10-22 07:26:30', 2, '45ba0cd0-8788-477e-8999-b356d69535d7', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 22:20:19', NULL, b'0', NULL, NULL),
('023900e7-5af2-11e4-8336-902b345dc018', '2014-10-22 07:26:30', 2, 'ac739e64-bcdf-4194-a67b-61566619e4d8', '0d3ce153-0b99-41b4-be18-cdf1aee1e52a', '2014-10-23 22:20:19', NULL, b'0', NULL, NULL),
('023931fd-5af2-11e4-8336-902b345dc018', '2014-10-21 07:36:45', 2, 'b05098a9-e38b-4b4a-9fe6-2390a956a9c0', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 22:20:19', NULL, b'0', NULL, NULL),
('0239623e-5af2-11e4-8336-902b345dc018', '2014-10-21 07:36:45', 5, '19c60c17-559c-431e-9c8c-c316ec2d2373', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 22:20:19', NULL, b'0', NULL, NULL),
('02399d83-5af2-11e4-8336-902b345dc018', '2014-10-21 07:36:45', 1, 'b05098a9-e38b-4b4a-9fe6-2390a956a9c0', '64ae0c84-5936-11e4-8185-902b345dc018', '2014-10-23 22:20:19', NULL, b'0', NULL, NULL),
('0239da61-5af2-11e4-8336-902b345dc018', '2014-10-21 07:36:45', 2, 'b3c3c4b3-5a30-11e4-a136-902b345dc018', '64ae0c84-5936-11e4-8185-902b345dc018', '2014-10-23 22:20:19', NULL, b'0', NULL, NULL),
('023a3f80-5af2-11e4-8336-902b345dc018', '2014-10-21 07:36:45', 2, '5a028276-adb2-4c9c-9086-6a6be4386652', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 22:20:19', NULL, b'0', NULL, NULL),
('2ba22c44-5af2-11e4-8336-902b345dc018', '2014-10-21 08:34:33', 2, 'c4973167-df75-4701-a9e9-3d44ff73e7ae', '0d3ce153-0b99-41b4-be18-cdf1aee1e52a', '2014-10-23 22:21:29', NULL, b'0', NULL, NULL),
('3ce9655e-5af2-11e4-8336-902b345dc018', '2014-10-16 12:32:51', 5, '19c60c17-559c-431e-9c8c-c316ec2d2373', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 22:21:58', NULL, b'0', NULL, NULL),
('4f82a173-5af2-11e4-8336-902b345dc018', '2014-10-22 08:26:29', 4, 'ac739e64-bcdf-4194-a67b-61566619e4d8', '0d3ce153-0b99-41b4-be18-cdf1aee1e52a', '2014-10-23 22:22:29', NULL, b'0', NULL, NULL),
('5d2570e0-5af2-11e4-8336-902b345dc018', '2014-10-20 06:33:44', 4, 'fba31b61-e609-40fd-8401-f4fd8347f5ae', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 22:22:52', NULL, b'0', NULL, NULL),
('836a51f2-5ad9-11e4-8336-902b345dc018', '2014-10-22 00:00:00', 2, '02d8efcf-19af-4b37-ad6c-39cc7cce5d25', '0d3ce153-0b99-41b4-be18-cdf1aee1e52a', '2014-10-23 19:24:58', NULL, b'0', NULL, NULL),
('8c0b477b-5af2-11e4-8336-902b345dc018', '2014-10-22 08:34:29', 4, '96e021a8-c036-413e-92e0-3475dba3d085', '64ae0c84-5936-11e4-8185-902b345dc018', '2014-10-23 22:24:10', NULL, b'0', NULL, NULL),
('8c0b80e0-5af2-11e4-8336-902b345dc018', '2014-10-19 09:39:44', 2, 'd166be6a-5f07-44be-9c40-f7a3e64890ff', '0d3ce153-0b99-41b4-be18-cdf1aee1e52a', '2014-10-23 22:24:10', NULL, b'0', NULL, NULL),
('92d72713-5ad9-11e4-8336-902b345dc018', '2014-10-15 00:00:00', 2, 'b3c3c4b3-5a30-11e4-a136-902b345dc018', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 19:25:24', NULL, b'0', NULL, NULL),
('a175c26c-5ad9-11e4-8336-902b345dc018', '2014-10-21 00:00:00', 5, 'ac739e64-bcdf-4194-a67b-61566619e4d8', '0d3ce153-0b99-41b4-be18-cdf1aee1e52a', '2014-10-23 19:25:49', NULL, b'0', NULL, NULL),
('aec17fe1-5af2-11e4-8336-902b345dc018', '2014-10-18 09:13:17', 2, '7480ede3-54d3-4849-b8c4-0048c2be4014', '0d3ce153-0b99-41b4-be18-cdf1aee1e52a', '2014-10-23 22:25:09', NULL, b'0', NULL, NULL),
('aec1d2b1-5af2-11e4-8336-902b345dc018', '2014-10-22 13:35:53', 5, '19c60c17-559c-431e-9c8c-c316ec2d2373', '64ae0c84-5936-11e4-8185-902b345dc018', '2014-10-23 22:25:09', NULL, b'0', NULL, NULL),
('cf10727f-5af2-11e4-8336-902b345dc018', '2014-10-19 06:28:30', 4, 'b05098a9-e38b-4b4a-9fe6-2390a956a9c0', '7dc64557-e04f-46bc-ac76-f58a0c90e655', '2014-10-23 22:26:03', NULL, b'0', NULL, NULL),
('cf10ac85-5af2-11e4-8336-902b345dc018', '2014-10-22 08:29:46', 4, '02d8efcf-19af-4b37-ad6c-39cc7cce5d25', '64ae0c84-5936-11e4-8185-902b345dc018', '2014-10-23 22:26:03', NULL, b'0', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tstores`
--

DROP TABLE IF EXISTS `tstores`;
CREATE TABLE IF NOT EXISTS `tstores` (
  `pkStoreUID` varchar(40) NOT NULL,
  `sStoreName` varchar(255) NOT NULL,
  `sStoreDescription` varchar(1000) DEFAULT NULL,
  `sStoreContactNumber` varchar(20) DEFAULT NULL,
  `sStoreEmail` varchar(255) NOT NULL,
  `sAddress1` varchar(255) NOT NULL,
  `sAddress2` varchar(255) DEFAULT NULL,
  `sAddress3` varchar(255) DEFAULT NULL,
  `sAddressCityTown` varchar(255) NOT NULL,
  `sPostalCode` int(11) DEFAULT NULL,
  `sAddressType` varchar(255) DEFAULT NULL,
  `dDateCreated` datetime NOT NULL,
  `dDateUpdated` datetime DEFAULT NULL,
  `blsArchived` bit(1) DEFAULT b'0',
  `dDateArchived` datetime DEFAULT NULL,
  `sArchivedReason` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`pkStoreUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tstores`
--

INSERT INTO `tstores` (`pkStoreUID`, `sStoreName`, `sStoreDescription`, `sStoreContactNumber`, `sStoreEmail`, `sAddress1`, `sAddress2`, `sAddress3`, `sAddressCityTown`, `sPostalCode`, `sAddressType`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) VALUES
('0d3ce153-0b99-41b4-be18-cdf1aee1e52a', 'Music World', NULL, '912 532 1351', 'music@global.com', '12 Brighton Road', NULL, NULL, 'London', 3514, NULL, '2014-10-23 17:52:40', '2014-10-23 22:05:05', b'0', NULL, ''),
('64ae0c84-5936-11e4-8185-902b345dc018', 'Rock Around The Clock', 'Rock around the clock record store', NULL, 'ratc@mail.com', '45 Fairtrees Road ', NULL, NULL, 'Manchester', NULL, NULL, '2014-10-21 17:24:48', '2014-10-23 22:03:32', b'0', NULL, ''),
('7dc64557-e04f-46bc-ac76-f58a0c90e655', 'London Records', NULL, '759 4212 531', 'london@recordsc.om', '12 Long Street', 'Central London', NULL, 'London', NULL, NULL, '2014-10-23 18:16:00', '2014-10-23 22:02:12', b'0', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `tusergroup`
--

DROP TABLE IF EXISTS `tusergroup`;
CREATE TABLE IF NOT EXISTS `tusergroup` (
  `pkUserGroupUID` varchar(40) NOT NULL,
  `sUserGroupName` varchar(255) NOT NULL,
  `sUserGroupDescription` varchar(1000) DEFAULT NULL,
  `dDateCreated` datetime NOT NULL,
  `dDateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`pkUserGroupUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tusergroup`
--

INSERT INTO `tusergroup` (`pkUserGroupUID`, `sUserGroupName`, `sUserGroupDescription`, `dDateCreated`, `dDateUpdated`) VALUES
('3ddf8f29-5936-11e4-8185-902b345dc018', 'Super user', 'Access to all stores sales', '2014-10-21 17:23:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tusers`
--

DROP TABLE IF EXISTS `tusers`;
CREATE TABLE IF NOT EXISTS `tusers` (
  `pkUserUID` varchar(40) NOT NULL,
  `sUserFirstName` varchar(255) NOT NULL,
  `sUserLastName` varchar(255) NOT NULL,
  `sUserEmail` varchar(255) NOT NULL,
  `sUserPassword` varchar(255) NOT NULL,
  `sUserContactNumber` int(11) DEFAULT NULL,
  `UserGroup_fkUserGroupUID` varchar(40) NOT NULL,
  `dDateCreated` datetime NOT NULL,
  `dDateUpdated` datetime DEFAULT NULL,
  `sUserSessionKey` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pkUserUID`),
  KEY `user_usergroup_ibfk_1` (`UserGroup_fkUserGroupUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tusers`
--

INSERT INTO `tusers` (`pkUserUID`, `sUserFirstName`, `sUserLastName`, `sUserEmail`, `sUserPassword`, `sUserContactNumber`, `UserGroup_fkUserGroupUID`, `dDateCreated`, `dDateUpdated`, `sUserSessionKey`) VALUES
('3d20796c-5938-11e4-8185-902b345dc018', 'Admin', 'Storeview', 'admin@storeview.com', '123', NULL, '3ddf8f29-5936-11e4-8185-902b345dc018', '2014-10-21 17:38:00', '2014-10-25 07:51:00', '42bbfc5550e6d2382b7213b95188624d');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tmedia`
--
ALTER TABLE `tmedia`
  ADD CONSTRAINT `media_chart_ibfk_1` FOREIGN KEY (`Chart_fkChartUID`) REFERENCES `tchartcategory` (`pkChartCatUID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `media_genre_ibfk_1` FOREIGN KEY (`Genre_fkGenreUID`) REFERENCES `tgenre` (`pkGenreUID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tsales`
--
ALTER TABLE `tsales`
  ADD CONSTRAINT `sales_media_ibfk_1` FOREIGN KEY (`Media_fkMediaUID`) REFERENCES `tmedia` (`pkMediaUID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sales_store_ibfk_1` FOREIGN KEY (`Store_fkStoreUID`) REFERENCES `tstores` (`pkStoreUID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tusers`
--
ALTER TABLE `tusers`
  ADD CONSTRAINT `user_usergroup_ibfk_1` FOREIGN KEY (`UserGroup_fkUserGroupUID`) REFERENCES `tusergroup` (`pkUserGroupUID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
