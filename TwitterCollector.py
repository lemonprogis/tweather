#################################################
# lemonprogis (11/16/2013 2:41 pm)
# TwitterCollector.py 
# Collects tweets that contain list of keywords
# Attempts to add location to each tweet
#   First - if has coordinates, use these lat lng points
#   Second - geocode place.full_name and take the first occurence
#   Lastly - Do nothing since no known location is availabe (0,0)
#################################################
import tweepy
import MySQLdb
from geopy import geocoders
import xml.etree.ElementTree as ET

def get_vars():
    tree = ET.parse('/path/to/variables.xml')
    root = tree.getroot()
    variables = {}
    for child in root:
        variables[child.tag] = child.text
    return variables


# some globals that I want to use for the moment
v = get_vars()
g = geocoders.GeoNames()



class MyStreamListener(tweepy.StreamListener):
    """ A listener handles tweets as they are received from the stream.
        This is a basic listener for tweets...could become generic and instatiated seperately.
    """

    def on_status(self,status):
        conn = MySQLdb.connect(host=v['host'], user=v['user'], passwd=v['password'], db=v['database']) # stored in variables.xml
        cur = conn.cursor()
        sql = '''INSERT INTO your_table_name (u_screen_name, u_name, u_profile_image_url, s_text, s_created_at, s_id_str, s_lang, s_retweet_count, s_retweeted, s_source, s_coord_lat, s_coord_lng)
                 VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
        l = []
        l.append(status.user.screen_name)
        l.append(status.user.name)
        l.append(status.user.profile_image_url)
        l.append(status.text)
        l.append(status.created_at)
        l.append(status.id_str)
        l.append(status.lang)
        l.append(status.retweet_count)
        l.append(status.retweeted)
        l.append(status.source)
        if status.coordinates is not None:
            l.append(status.coordinates['coordinates'][1]) # lat
            l.append(status.coordinates['coordinates'][0]) # lng
        else:
            if status.place is not None:
                places = g.geocode(status.place.full_name,exactly_one=False)
                l.append(places[1][1][0]) # lat
                l.append(places[1][1][1]) # lng
            else:
                l.append(0)
                l.append(0)
        #print "Size of list: ",len(l)
        #print sql % tuple(l)
        
        tl = tuple(l) # create a tuple from our list of status items
        try:
            #print sql % tl
            cur.execute(sql,tl)
            conn.commit()
        except:
            conn.rollback()
        return True

    def on_error(self,status):
        print "Error!!!"
        return True


if __name__ == '__main__':
    var = get_vars() # get all the vars
    auth1 = tweepy.OAuthHandler(var['consumer_key'], var['consumer_secret'])
    auth1.set_access_token(var['access_token'], var['access_token_secret'])
    api = tweepy.API(auth1)
    streamer = tweepy.Stream(auth1, MyStreamListener())
    keywords = var['keywords'].split(',') # split keywords
    streamer.filter(track=keywords)
