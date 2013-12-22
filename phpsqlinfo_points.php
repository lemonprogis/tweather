<?php
$username = "your_db_username";
$password = "your_db_password";
$database = "your_db_name";
$myhost = "your_db_host";
// Start XML file, create parent node
header("Content-type: text/xml");
//echo "<markers>";
$dom = new DOMDocument("1.0");
$node = $dom->createElement("markers");
$parnode = $dom->appendChild($node); 

// Opens a connection to a MySQL server
$connection=mysql_connect ($myhost, $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}
$date = date("Y-m-d H:m:s", strtotime('-24 hours')); // 24 hours from access date

$result = mysql_query("SELECT * from your_table_name where s_coord_lat != 0 and s_coord_lng != 0 order by s_created_at DESC");
if(!$result) {
	$message = 'Invalid Query: ' . mysql_error() . "\n";
	die($message);
}

// Iterate through the rows, adding XML nodes for each

while ($row = @mysql_fetch_assoc($result)){  
  // only get the ones from the past 24 hours  
  if($row['insert_dt'] >= $date){
    $node = $dom->createElement("marker");  
    $newnode = $parnode->appendChild($node);   
    $newnode->setAttribute("u_screen_name", utf8_encode($row['u_screen_name']));  
    $newnode->setAttribute("u_name", utf8_encode($row['u_name']));
    $newnode->setAttribute("u_pic", utf8_encode($row['u_profile_image_url'])); 
    $newnode->setAttribute("s_text", utf8_encode($row['s_text']));
    $newnode->setAttribute("s_created_at", utf8_encode($row['s_created_at']));
    $newnode->setAttribute("s_id_str", utf8_encode($row['s_id_str']));
    $newnode->setAttribute("s_lang", utf8_encode($row['s_lang']));
    $newnode->setAttribute("s_retweet_count", utf8_encode($row['s_retweet_count']));
    $newnode->setAttribute("s_retweeted", utf8_encode($row['s_retweeted']));
    $newnode->setAttribute("s_source", utf8_encode($row['s_source']));
    $newnode->setAttribute("lat", utf8_encode($row['s_coord_lat']));
    $newnode->setAttribute("lng", utf8_encode($row['s_coord_lng']));
    $newnode->setAttribute("insert_date", utf8_encode($row['insert_dt']));
  }
} 
//echo "</markers>";
echo $dom->saveXML();
?>
