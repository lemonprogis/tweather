tweather
========

Twitter and Weather Map Mash-up

Collect tweets by keyword and then pull them to display on a gooogle map or list.
For a working example of all this, i am using it here http://lemonprogis.com/EntergyTwitter/

There are three main components to performing this task. 

1. Create a table to store collected tweets in MySQL Database.
2. Start collecting tweets that contain keywords you want to follow.
3. Pull collected tweets from database and display on a map.

Create Tables in MySQL
======================

The scripts provided will create the table needed to store the tweets data that will be parsed in TwitterCollector.py. remember the name of the table as it will need to be updated in the php files.  Also, if you want to collect more fields, explore twitters tweet, entity, places, and user objects more in depth here https://dev.twitter.com/docs/platform-objects

TwitterCollector.py
===================
requires tweepy, MySQLdb, geopy libraries. Use pip or easy_install to get the libraries.
requires that you create an app under twitter developers page. 
This will get you your oAuth tokens and secrets. https://dev.twitter.com/docs/auth/obtaining-access-tokens

Once completed, add this info to your varibables.xml file. In TwitterCollector.py, add the path to your variables.xml.
For example, 
<pre>
tree = ET.parse('conf/variables.xml')
</pre>


map.js
======
requires you get a token from google maps api v3 https://developers.google.com/maps/documentation/javascript/tutorial
requires arcgislink for the map to overlay arcgis dynamic layers onto a google map http://google-maps-utility-library-v3.googlecode.com/svn/trunk/arcgislink/docs/examples.html

make sure this file and your php files are in the same directory or you will need to change the locations in map.js for it to read phpsqlinfo_points.php.

This creates the base you will need to see the map and tweets as they come in. 
setInterval has been set to 10 seconds.
<pre>
  // this refreshes the markers every 10 secods
    setInterval(function(){ loadMarkers(); }, 10000);
</pre>

To display a table of contents of arcgis server layers, add a div with the <pre>id="toc"</pre> to a ul item.


phpsqlinfo_points.php
=====================

change the info in order to connect to your MySQL db instance. This will create an xml of tweets from the last 24 hours. If you want all of them simply comment out the conditional statement while iterating through the rows.
<pre>
 // only get the ones from the past 24 hours  
 // if($row['insert_dt'] >= $date){
 ...and don't forget the other curly brace!
 // }
 </pre>

tweets.php
==========

similar to phpsqlinfo_points.php, this will query the database and provide the data in json format. 
Similarly, comment out if you want all and not from within the last 24 hours.
<pre>
 // only get the ones from the past 24 hours  
 // if($row['insert_dt'] >= $date){
 ...and don't forget the other curly brace!
 // }
 </pre>
 
 I use this in order to use jquery's DataTable library. 
 <pre>
  $(document).ready(function(){
      var oTable = $('#tweetTable').dataTable({
                      "bProcessing": true,
                      "sAjaxSource": 'tweets.php'

                  });
      oTable.fnSort([[3,'desc']])
    });
 </pre>
 
 Link to the library and more information http://datatables.net/

Disclaimer
==========

This code here has no warranties. It can be freely distributed and modified to suit your needs.

