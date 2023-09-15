-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: rtrt
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_user`
--

DROP TABLE IF EXISTS `app_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `app_user_roles` varchar(15) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registered` bit(1) NOT NULL,
  `telephone_number` varchar(30) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_1j9d9a06i600gd43uu3km82jw` (`email`),
  UNIQUE KEY `UK_8ytxy3ed38l2j2mknrijkbopk` (`telephone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_user`
--

LOCK TABLES `app_user` WRITE;
/*!40000 ALTER TABLE `app_user` DISABLE KEYS */;
INSERT INTO `app_user` VALUES (1,'ROLE_ADMIN','1998-08-20','admin@gmail.com','Abdul','Oudeh','$2a$12$gb/aot/S/kL7PNFVsrv/B.v6XIrgWFVQo.V.FOSV74ydKlmfFwfHO',_binary '','01715120398'),(2,'ROLE_CLIENT','1993-05-10','client@gmail.com','Max','Mustermann','$2a$12$t8xEgHG.wT9mob4LwXx6LegGKuQ5pG1MbmJUdJH0WbWeIJKPKLwRy',_binary '','01715122222'),(3,'ROLE_CLIENT',NULL,'tomas_1234@gmail.com','Tomas','Müller','$2a$12$K2pXa40V5UCSu.tjhxepLe1gkYo1mA8J8Lv09i/x0pu5c73yYMHN6',_binary '','017151212345'),(4,'ROLE_CLIENT','1990-05-25','martin_mu_1234@gmail.com','Martin','Müller','$2a$12$Fu7/3QLp/Hchfowt60nrneodIysLfnbd5Y2umFBUuc.wFZiazV8PS',_binary '','01715121333'),(5,'ROLE_CLIENT','1992-04-11','noahschmidt_92@hotmail.com','Noah','Schmidt','$2a$12$YWBG9ai1/nu3Mh8iXPPBdOPUGeVYSk7KuFGestRcVFU7XTbyS36Aa',_binary '','01718348278'),(6,'ROLE_CLIENT','1994-11-03','schneider_94.sophie@hotmail.com','Sophie','Schneider','$2a$12$4hZfFLsHYgtsymMo3.bB/eYk21S87Mz2yfaiXszPN.OEBqwxsqghm',_binary '','01721575223'),(7,'ROLE_CLIENT','1997-12-16','emi_fi1997@icloud.com','Emilia','Fischer','$2a$12$NnX0D.qsGEywiMMhujN38ujtGoMWwF0eCjWcfujcxv8Df62tV2BMO',_binary '','01715440842'),(8,'ROLE_CLIENT','1999-02-20','emma_mey3214@icloud.com','Emma','Meyer','$2a$12$8ZEkfWGDh3DM1Fgazfm2SO5T7EGZzZRrTx7fHXA29In9XJOHVdiMi',_binary '','01717996909'),(9,'ROLE_CLIENT',NULL,'lina.wagner15322@customer.com','Lina','Wagner','$2a$12$UAQSxvTUcRNrKRt9CI6pX.93V1Zv7ZxhUYDMARpJRAeUNt.4WvzPa',_binary '\0','01715855546'),(10,'ROLE_CLIENT',NULL,'hanna.müller974@customer.com','Hanna','Müller','$2a$12$G.zyY6VZqzjQD0lsbbw1fueIE5ZUNROOVfcMnjqT9GSm1XoIuZJdi',_binary '\0','01717490612'),(11,'ROLE_CLIENT','1987-03-15','emueller.tom87@icloud.com','Tomas','Müller','$2a$12$5sgXLFDclS55SWp34sZ8bel29s2zek9epoClZkWBWMgKjp0grE8IC',_binary '','01716013348'),(12,'ROLE_CLIENT',NULL,'gianluigi.buffon1666@customer.com','Gianluigi','Buffon','$2a$12$uFjO4P.V1Zx3K7ykneMeEueJR0v1EEWQSQokewiVRvvc2SDma7CA.',_binary '\0','01717016756');
/*!40000 ALTER TABLE `app_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-04 13:01:15
