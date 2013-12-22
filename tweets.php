<?php
$username = "your_db_username";
$password = "your_db_password";
$database = "your_db_name"; 
$myhost = "your_db_host";

function makeClickableLinks($s) {
  return preg_replace('@(https?://([-\w\.]+[-\w])+(:\d+)?(/([\w/_\.#-]*(\?\S+)?[^\.\s])?)?)@', '<a href="$1" target="_blank">$1</a>', $s);
}

header("Content-type: application/json");
// Opens a connection to a MySQL server
$connection=mysql_connect ($myhost, $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error(). "\n");
}
$date = date("Y-m-d H:m:s", strtotime('-24 hours')); // access date - 24 hours
$result = mysql_query("SELECT u_screen_name as 'Screen Name', u_name as 'Name', s_text as 'Tweet', s_created_at as 'Created At', s_id_str as 'Tweet ID', s_retweet_count as 'Retweet Count', s_retweeted as 'Retweeted', s_source as 'Source', s_coord_lat as 'Latitude', s_coord_lng as 'Longitude', insert_dt as 'Inserted' from your_table_name");
if(!$result) {
	$message = 'Invalid Query: ' . mysql_error() . "\n";
	die($message);
}
// Iterate through the rows, 
while ($r = @mysql_fetch_assoc($result)){  
  // only return those within 24 hours
  if($r['Inserted'] >= $date){
    $row[] = array(utf8_encode($r['Screen Name']),
                   utf8_encode($r['Name']), 
                   makeClickableLinks(utf8_encode($r['Tweet'])), 
                   utf8_encode($r['Created At']),
                   utf8_encode($r['Tweet ID']),
                   utf8_encode($r['Retweet Count']),
                   utf8_encode($r['Retweeted']),
                   utf8_encode($r['Source']),
                  utf8_encode($r['Latitude']),
                  utf8_encode($r['Longitude']));
  }
} 

$mainJson =  array('aaData' => $row);
print json_encode($mainJson);

?>
