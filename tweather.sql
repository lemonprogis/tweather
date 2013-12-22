
-- create a new table named e_tweets or whatever you want
-- DROP TABLE IF EXISTS `e_tweets`;

CREATE TABLE IF NOT EXISTS `e_tweets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_screen_name` varchar(55) DEFAULT NULL,
  `u_name` varchar(120) DEFAULT NULL,
  `s_text` text,
  `s_created_at` datetime DEFAULT NULL,
  `s_id_str` varchar(55) DEFAULT NULL,
  `s_lang` varchar(10) DEFAULT NULL,
  `s_retweet_count` int(11) DEFAULT NULL,
  `s_retweeted` varchar(20) DEFAULT NULL,
  `s_source` varchar(120) DEFAULT NULL,
  `s_coord_lat` float DEFAULT NULL,
  `s_coord_lng` float DEFAULT NULL,
  `s_point` point DEFAULT NULL,
  `insert_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


-- backup sql statement, i use this to duplicate table and data before truncating e_tweets
/*
CREATE TABLE ar_storm_ice LIKE e_tweets;
INSERT INTO ar_storm_ice SELECT * FROM e_tweets;

-- be careful with this statement.
TRUNCATE TABLE e_tweets;
*/
